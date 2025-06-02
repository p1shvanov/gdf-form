import Keyboard from './keyboard.js';
import { SheetsService } from './sheets-service.js';

export class TerminalAnimation {
  constructor(targetId, words, colors) {
    this.historyTarget = document.getElementById('terminal-history');
    this.inputTarget = document.getElementById('terminal-input');
    this.words = words || [];
    this.colors = colors || ["#fff"];
    this.commands = [];
    this.maxCommands = 10;
    this.currentCommand = "";
    this.username = "gdf-user";
    this.commandPrefix = "$ ";
    this.isProcessing = false;
    this.sheetsService = new SheetsService();
    
    this.init();
  }

  init() {
    this.historyTarget.innerHTML = "";
    this.inputTarget.innerHTML = "";
    this.updateTerminal();
    
    // Initialize keyboard
    Keyboard.init();
    
    // Setup keyboard input
    this.setupKeyboard();

    // Add keyboard event listeners
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.submitCommand();
      }
    });
  }

  setupKeyboard() {
    Keyboard.setCallbacks(
      (value) => {
        this.currentCommand = this.getPrompt() + value;
        this.updateTerminal();
      },
      () => {
        this.submitCommand();
      }
    );
  }

  submitCommand() {
    if (this.currentCommand.trim() === this.getPrompt().trim()) {
      return; // Don't process empty commands
    }
    this.processCommand(this.currentCommand);
  }

  getPrompt() {
    return `<span class="terminal-prompt">${this.commandPrefix}</span>`;
  }

  getUsername() {
    return `<span class="terminal-username">${this.username}</span>`;
  }

  async processCommand(command) {
    // Show processing state
    this.isProcessing = true;
    this.updateTerminal();
    
    try {
      // Extract the command text without the prompt and username
      const commandText = command.replace(this.commandPrefix, "").trim();
      
      // Submit the word to Google Sheets
      await this.sheetsService.submitWord(commandText);
      
      // Add both command and its output to history
      this.commands.push(`<span class="terminal-username">${this.username}</span> ${command}`);
      this.commands.push(`<div class="terminal-output">Word "${commandText}" submitted successfully. Waiting for moderation.</div>`);
    } catch (error) {
      // Add error message to history
      this.commands.push(`<span class="terminal-username">${this.username}</span> ${command}`);
      this.commands.push(`<div class="terminal-error">Error: Failed to submit word. Please try again later.</div>`);
    }
    
    // Remove oldest commands if we exceed the limit
    while (this.commands.length > this.maxCommands) {
      this.commands.shift();
    }
    
    // Reset for next command
    this.currentCommand = this.getPrompt();
    this.isProcessing = false;
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
    }
    
    // Add the command text as a separate span for better styling
    const commandText = this.currentCommand.replace(this.commandPrefix, "");
    this.inputTarget.innerHTML = `<div class="${inputClass}">${this.getUsername()} ${this.getPrompt()}<span class="terminal-command">${commandText}</span><span class="cursor">_</span></div>`;
    
    // Auto-scroll history to bottom
    this.historyTarget.scrollTop = this.historyTarget.scrollHeight;
  }
} 