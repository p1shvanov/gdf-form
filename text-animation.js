export class TextAnimation {
  constructor(targetId, words, colors) {
    this.target = document.getElementById(targetId);
    this.words = words || [];
    this.colors = colors || ["#fff"];
    this.visible = true;
    this.letterCount = 1;
    this.x = 1;
    this.waiting = false;

    this.init();
  }

  init() {
    this.target.setAttribute("style", `color:${this.colors[0]}`);
    this.startWordInterval();
    this.startUnderscoreInterval();
  }

  startWordInterval() {
    setInterval(() => {
      if (this.letterCount === 0 && !this.waiting) {
        this.waiting = true;
        this.target.innerHTML = this.words[0].substring(0, this.letterCount);

        setTimeout(() => {
          const usedColor = this.colors.shift();
          this.colors.push(usedColor);
          const usedWord = this.words.shift();
          this.words.push(usedWord);
          this.x = 1;
          this.target.setAttribute("style", `color:${this.colors[0]}`);
          this.letterCount += this.x;
          this.waiting = false;
        }, 1000);
      } else if (
        this.letterCount === this.words[0].length + 1 &&
        !this.waiting
      ) {
        this.waiting = true;
        setTimeout(() => {
          this.x = -1;
          this.letterCount += this.x;
          this.waiting = false;
        }, 1000);
      } else if (!this.waiting) {
        this.target.innerHTML = this.words[0].substring(0, this.letterCount);
        this.letterCount += this.x;
      }
    }, 120);
  }

  startUnderscoreInterval() {
    const con = document.getElementById("console");
    setInterval(() => {
      if (this.visible) {
        con.className = "console-underscore hidden";
        this.visible = false;
      } else {
        con.className = "console-underscore";
        this.visible = true;
      }
    }, 400);
  }
}
