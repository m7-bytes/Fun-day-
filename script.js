const messages = [
    "Hey there! 👋 Ready for something fun?",
    "Do you like surprises? 🎁",
    "Would you click Yes if I asked nicely? 😏",
    "Are you still with me?",
    "Quick! Count backwards: 3... 2... 1...",
    "Final question... ready?",
    "Here comes the grand finale 💧"
];

let currentMessage = 0;
let noClicks = 0;

const messageEl = document.getElementById('message');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

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
        changeBackground();
        currentMessage++;
    }
}

function changeBackground() {
    const colors = [
        "#ff9a9e,#fad0c4",
        "#a18cd1,#fbc2eb",
        "#fad0c4,#ffd1ff",
        "#ffecd2,#fcb69f",
        "#ffdde1,#ee9ca7"
    ];
    let bg = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.background = `linear-gradient(135deg, ${bg})`;
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
    const finalText = messages[messages.length - 1];
    messageEl.innerHTML = "";
    for (let char of finalText) {
        const letter = document.createElement('div');
        letter.classList.add('falling-letter');
        letter.textContent = char;
        letter.style.left = Math.random() * window.innerWidth + "px";
        letter.style.color = `hsl(${Math.random()*360}, 80%, 70%)`;
        letter.style.transform = `rotate(${Math.random()*60 - 30}deg)`;
        document.body.appendChild(letter);

        setTimeout(() => {
            letter.style.top = (window.innerHeight - 60) + "px";
            createRipple(letter.style.left);
        }, Math.random() * 500);
    }
}

function createRipple(x) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    ripple.style.left = x;
    ripple.style.top = (window.innerHeight - 50) + "px";
    ripple.style.width = "20px";
    ripple.style.height = "20px";
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

yesBtn.addEventListener('click', () => {
    floatingEmoji();
    nextMessage();
});

noBtn.addEventListener('click', () => {
    noClicks++;
    floatingEmoji();
    if (noClicks === 3) {
        alert("😏 You like saying No… but it won't change anything!");
    }
    nextMessage();
});

// Start game
nextMessage();
