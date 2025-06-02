export class TerminalAnimation {
  constructor(targetId, words, colors) {
    this.historyTarget = document.getElementById('terminal-history');
    this.inputTarget = document.getElementById('terminal-input');
    this.words = words || [];
    this.colors = colors || ["#fff"];
    this.commands = [];
    this.maxCommands = 10;
    this.currentCommand = "";
    this.letterCount = 0;
    this.waiting = false;
    this.username = "gdf-user";
    this.commandPrefix = "$ ";
    this.isProcessing = false;
    this.isGenerating = false;
    this.alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    
    this.init();
  }

  init() {
    this.historyTarget.innerHTML = "";
    this.inputTarget.innerHTML = "";
    this.startCommandInterval();
  }

  getPrompt() {
    return `<span class="terminal-prompt">${this.commandPrefix}</span>`;
  }

  getUsername() {
    return `<span class="terminal-username">${this.username}</span>`;
  }

  async generateCharacter(targetChar, currentChar) {
    const delay = 50;
    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts) {
      const randomChar = this.alphabet[Math.floor(Math.random() * this.alphabet.length)];
      this.currentCommand = this.getPrompt() + `<span class="terminal-command">${this.words[0].substring(0, this.letterCount - 1)}${randomChar}</span>`;
      this.updateTerminal();
      await new Promise(resolve => setTimeout(resolve, delay));
      attempts++;
    }

    // Finally set the correct character
    this.currentCommand = this.getPrompt() + `<span class="terminal-command">${this.words[0].substring(0, this.letterCount)}</span>`;
    this.updateTerminal();
  }

  simulateCommandProcessing(command) {
    const processingTime = Math.random() * 1000 + 500;
    const output = this.generateCommandOutput(command);
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(output);
      }, processingTime);
    });
  }

  generateCommandOutput(command) {
    // Extract the command text without the prompt and username
    const commandText = command.replace(this.commandPrefix, "").trim();
    
    // Different types of outputs based on command content
    if (commandText.includes("error") || commandText.includes("fail")) {
      return `<div class="terminal-error">Error: Command '${commandText}' failed</div>`;
    }
    
    if (commandText.includes("list") || commandText.includes("ls")) {
      return `<div class="terminal-output">file1.txt<br>file2.txt<br>directory1/</div>`;
    }
    
    if (commandText.includes("status") || commandText.includes("info")) {
      return `<div class="terminal-output">System status: OK<br>Memory usage: 45%<br>CPU load: 23%</div>`;
    }

    // Random output variations for regular commands
    const outputs = [
      `<div class="terminal-output">Command "${commandText}" executed successfully</div>`,
      `<div class="terminal-output">Processing "${commandText}"...<br><span class="checkmark">✓</span> Operation completed</div>`,
      `<div class="terminal-output">Analyzing "${commandText}"...<br><span class="checkmark">✓</span> Successfully processed</div>`,
      `<div class="terminal-output">Executing "${commandText}"...<br><span class="checkmark">✓</span> Done</div>`,
      `<div class="terminal-output">Running "${commandText}"...<br><span class="checkmark">✓</span> Task finished</div>`,
      `<div class="terminal-output">Initializing "${commandText}"...<br><span class="checkmark">✓</span> System updated</div>`,
      `<div class="terminal-output">Loading "${commandText}"...<br><span class="checkmark">✓</span> Module activated</div>`,
      `<div class="terminal-output">Compiling "${commandText}"...<br><span class="checkmark">✓</span> Build successful</div>`,
      `<div class="terminal-output">Deploying "${commandText}"...<br><span class="checkmark">✓</span> Deployment complete</div>`,
      `<div class="terminal-output">Testing "${commandText}"...<br><span class="checkmark">✓</span> All tests passed</div>`
    ];
    
    return outputs[Math.floor(Math.random() * outputs.length)];
  }

  async startCommandInterval() {
    while (true) {
      if (this.letterCount === 0 && !this.waiting) {
        this.waiting = true;
        this.currentCommand = this.getPrompt() + `<span class="terminal-command">${this.words[0].substring(0, this.letterCount)}</span>`;
        this.updateTerminal();

        await new Promise(resolve => setTimeout(resolve, 1000));
        const usedWord = this.words.shift();
        this.words.push(usedWord);
        this.letterCount = 1;
        this.waiting = false;
      } else if (this.letterCount === this.words[0].length + 1 && !this.waiting) {
        this.waiting = true;
        const fullCommand = this.currentCommand;
        
        // Show processing state
        this.isProcessing = true;
        this.updateTerminal();
        
        // Wait for processing to complete
        const output = await this.simulateCommandProcessing(fullCommand);
        
        // Add both command and its output to history
        this.commands.push(`<span class="terminal-username">${this.username}</span> ${fullCommand}`);
        this.commands.push(output);
        
        // Remove oldest commands if we exceed the limit
        while (this.commands.length > this.maxCommands) {
          this.commands.shift();
        }
        
        // Reset for next command
        this.currentCommand = this.getPrompt() + `<span class="terminal-command"></span>`;
        this.letterCount = 0;
        this.waiting = false;
        this.isProcessing = false;
        this.updateTerminal();
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else if (!this.waiting) {
        // Generate the next character with animation
        await this.generateCharacter(
          this.words[0][this.letterCount],
          this.words[0][this.letterCount - 1]
        );
        this.letterCount++;
      }
    }
  }

  updateTerminal() {
    // Update history
    let historyContent = "";
    this.commands.forEach(cmd => {
      historyContent += `<div class="terminal-line">${cmd}</div>`;
    });
    this.historyTarget.innerHTML = historyContent;
    
    // Update input line with appropriate class
    let inputClass = "terminal-line typing";
    if (this.isProcessing) {
      inputClass += " processing";
    } else if (this.isGenerating) {
      inputClass += " generating";
    }
    
    this.inputTarget.innerHTML = `<div class="${inputClass}">${this.getUsername()} ${this.currentCommand}<span class="cursor">_</span></div>`;
    
    // Auto-scroll history to bottom
    this.historyTarget.scrollTop = this.historyTarget.scrollHeight;
  }
} 