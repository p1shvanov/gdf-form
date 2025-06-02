export class SheetsService {
    // https://docs.google.com/spreadsheets/d/1pAMVawuJ3yqZ2hbJaUMX5NKIL7ggGbTaCOD-3ILTekU/edit?gid=0#gid=0
  constructor() {
    // Replace this with your Google Apps Script Web App URL
    this.SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw_8XlKlkUKKgPB_El1SU9cPly-A3FP2iVIn2B-0puKHmZm4Gdgit61ZRK7vNdIaCzikg/exec';
    this.queue = [];
    this.isProcessing = false;
    this.lastTimestamp = '1970-01-01T00:00:00.000Z';
    this.retryDelay = 1000; // 1 second
    this.maxRetries = 3;
  }

  cleanInput(word) {
    // Remove any HTML tags and trim whitespace
    return word.replace(/<[^>]*>/g, '').trim();
  }

  async submitWord(word) {
    const cleanWord = this.cleanInput(word);
    
    if (!cleanWord) {
      throw new Error('Empty word after cleaning');
    }

    // Add to queue
    this.queue.push(cleanWord);
    
    // Start processing if not already processing
    if (!this.isProcessing) {
      this.processQueue();
    }

    return {
      status: 'queued',
      message: 'Word added to queue'
    };
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    let retries = 0;

    while (this.queue.length > 0 && retries < this.maxRetries) {
      try {
        const word = this.queue[0];
        
        const response = await fetch(this.SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: JSON.stringify({
            value: word,
            verified: false
          })
        });

        // Remove the word from queue if successful
        this.queue.shift();
        retries = 0; // Reset retries on success

        // Add small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Error submitting word:', error);
        retries++;
        
        if (retries < this.maxRetries) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * retries));
        } else {
          // Move failed word to the end of queue
          const failedWord = this.queue.shift();
          this.queue.push(failedWord);
          retries = 0;
        }
      }
    }

    this.isProcessing = false;
  }

  async getWords(options = {}) {
    const {
      limit = 500,
      random = true,
      lastTimestamp = this.lastTimestamp
    } = options;

    try {
      const response = await fetch(`${this.SCRIPT_URL}?limit=${limit}&random=${random}&lastTimestamp=${lastTimestamp}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        }
      });

      // Since we're using no-cors, we can't read the response
      // We'll update the timestamp and return a mock response
      this.lastTimestamp = new Date().toISOString();
      
      return {
        status: 'success',
        words: [],
        total: 0,
        timestamp: this.lastTimestamp
      };
    } catch (error) {
      console.error('Error fetching words:', error);
      throw error;
    }
  }
} 