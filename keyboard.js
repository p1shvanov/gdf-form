export default class Keyboard {
    static LANGUAGES = {
        EN: 'en',
        RU: 'ru'
    };

    static KEYBOARD_LAYOUTS = {
        [Keyboard.LANGUAGES.EN]: {
            'q': 'q', 'w': 'w', 'e': 'e', 'r': 'r', 't': 't', 'y': 'y', 'u': 'u', 'i': 'i', 'o': 'o', 'p': 'p',
            'a': 'a', 's': 's', 'd': 'd', 'f': 'f', 'g': 'g', 'h': 'h', 'j': 'j', 'k': 'k', 'l': 'l',
            'z': 'z', 'x': 'x', 'c': 'c', 'v': 'v', 'b': 'b', 'n': 'n', 'm': 'm',
            ',': ',', '.': '.', '?': '?'
        },
        [Keyboard.LANGUAGES.RU]: {
            'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з',
            'a': 'ф', 's': 'ы', 'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л', 'l': 'д',
            'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и', 'n': 'т', 'm': 'ь',
            ',': 'б', '.': 'ю', '?': '?'
        }
    };

    static init() {
        if (this.instance) {
            return;
        }
        this.instance = new Keyboard();
    }

    static setCallbacks(onInput, onSubmit) {
        if (!this.instance) {
            this.init();
        }
        this.instance.onInput = onInput;
        this.instance.onSubmit = onSubmit;
    }

    constructor() {
        this.onInput = null;
        this.onSubmit = null;
        this.value = "";
        this.isCapsLock = false;
        this.currentLanguage = Keyboard.LANGUAGES.EN;
        this.createKeyboard();
    }

    createKeyboard() {
        const main = document.createElement('div');
        main.className = 'keyboard';
        
        const keysContainer = document.createElement('div');
        keysContainer.className = 'keyboard__keys';
        
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "lang", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space", "done"
        ];

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");
            keyElement.dataset.key = key; // Store the original key

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");
                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");
                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");
                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");
                    break;

                case "lang":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.textContent = "RU";
                    break;

                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");
                    break;

                default:
                    keyElement.textContent = this.getKeyText(key);
            }

            keyElement.addEventListener("click", () => this.handleKeyClick(key));
            keysContainer.appendChild(keyElement);

            if (insertLineBreak) {
                keysContainer.appendChild(document.createElement("br"));
            }
        });

        main.appendChild(keysContainer);
        document.body.appendChild(main);
        this.keyboard = main;
    }

    getKeyText(key) {
        const char = Keyboard.KEYBOARD_LAYOUTS[this.currentLanguage][key] || key;
        return this.isCapsLock ? char.toUpperCase() : char.toLowerCase();
    }

    updateKeyboardLayout() {
        this.keyboard.querySelectorAll('.keyboard__key').forEach(keyElement => {
            const originalKey = keyElement.dataset.key;
            if (originalKey && !keyElement.innerHTML.includes('material-icons')) {
                keyElement.textContent = this.getKeyText(originalKey);
            }
        });
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === Keyboard.LANGUAGES.EN 
            ? Keyboard.LANGUAGES.RU 
            : Keyboard.LANGUAGES.EN;
        
        const langButton = this.keyboard.querySelector('[data-key="lang"]');
        langButton.textContent = this.currentLanguage === Keyboard.LANGUAGES.EN ? 'RU' : 'EN';
        
        this.updateKeyboardLayout();
    }

    handleKeyClick(key) {
        if (key === 'backspace') {
            this.value = this.value.slice(0, -1);
        } else if (key === 'space') {
            this.value += ' ';
        } else if (key === 'enter') {
            this.value += '\n';
        } else if (key === 'caps') {
            this.isCapsLock = !this.isCapsLock;
            this.keyboard.querySelector('[data-key="caps"]').classList.toggle('keyboard__key--active', this.isCapsLock);
            this.updateKeyboardLayout();
        } else if (key === 'lang') {
            this.toggleLanguage();
            return;
        } else if (key === 'done') {
            if (this.onSubmit) {
                this.onSubmit(this.value);
            }
            this.value = "";
            return;
        } else {
            const char = this.getKeyText(key);
            this.value += char;
        }
        
        if (this.onInput) {
            this.onInput(this.value);
        }
    }
} 