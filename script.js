const messages = [
    "Hey Sana! 👋 Ready for something fun?",
    "Do you like surprises? 🎁",
    "Would you click Yes if I asked nicely? 😏",
    "Are you still with me?",
    "Quick! Count backwards: 3... 2... 1...",
    "Final question... ready?",
    "Your Successfully wasted 30 seconds on this stupid page 🤓"
];

let currentMessage = 0;
let noClicks = 0;

const messageEl = document.getElementById('message');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const popup = document.getElementById('popup');
const popupClose = document.getElementById('popup-close');

function typeMessage(text, callback) {
    let i = 0;
    messageEl.innerHTML = "";
    function type() {
        if (i < text.length) {
            messageEl.innerHTML += text[i];
            i++;
            setTimeout(type, 50);
        } else if (callback) {
            callback();
        }
    }
    type();
}

function nextMessage() {
    if (currentMessage < messages.length) {
        typeMessage(messages[currentMessage], () => {
            if (currentMessage === messages.length - 1) {
                setTimeout(spillLetters, 1000);
            }
        });
        currentMessage++;
    }
}

function floatingEmoji() {
    const emojiList = ["🎉","😂","😍","😏","💖","✨","💦","🔥","🥳","🫧"];
    const emoji = document.createElement('div');
    emoji.textContent = emojiList[Math.floor(Math.random() * emojiList.length)];
    emoji.style.position = 'absolute';
    emoji.style.left = Math.random() * window.innerWidth + "px";
    emoji.style.top = window.innerHeight + "px";
    emoji.style.fontSize = "2rem";
    document.body.appendChild(emoji);

    let pos = window.innerHeight;
    const move = setInterval(() => {
        pos -= 3;
        emoji.style.top = pos + "px";
        if (pos < -50) {
            emoji.remove();
            clearInterval(move);
        }
    }, 16);
}

function spillLetters() {
    const finalText = "💦 SPLASH 💦";
    messageEl.innerHTML = "";
    for (let char of finalText) {
        const letter = document.createElement('div');
        letter.classList.add('falling-letter');
        letter.textContent = char;
        letter.style.left = Math.random() * window.innerWidth + "px";
        letter.style.color = `hsl(${Math.random()*360}, 80%, 70%)`;
        letter.style.top = "-50px";
        letter.style.transform = `rotate(${Math.random()*60 - 30}deg)`;
        document.body.appendChild(letter);

        let y = -50;
        const fall = setInterval(() => {
            y += 5;
            if (y >= window.innerHeight - 60) {
                y = window.innerHeight - 60;
                clearInterval(fall);
            }
            letter.style.top = y + "px";
        }, 16);
    }
}

yesBtn.addEventListener('click', () => {
    floatingEmoji();
    nextMessage();
});

noBtn.addEventListener('click', () => {
    noClicks++;
    floatingEmoji();
    if (noClicks === 3) {
        popup.style.display = "flex";
    } else {
        nextMessage();
    }
});

popupClose.addEventListener('click', () => {
    popup.style.display = "none";
    nextMessage();
});

// Start game
nextMessage();
