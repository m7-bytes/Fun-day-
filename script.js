const messages = [
    "Hey 👋 Can I ask you something?",
    "Promise you’ll answer honestly? 🤨",
    "Do you like surprises? 🎁",
    "Good... because this is going to be fun 😏",
    "Do you think I can guess your favorite color? 🎨",
    "Haha! I was totally going to say blue anyway 💙",
    "Want to try a quick game?",
    "Okay... are you ready?",
    "Here it comes in 3... 2... 1...",
    "SURPRISE! 🎉 You’re awesome!",
    "Seriously, you made it this far... respect ✊",
    "Now for the final question...",
    "Do you want to see something super cool? 🤯",
    "YOU WON 🎊"
];

let currentMessage = 0;
let isFinal = false;

const messageElement = document.getElementById("message");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

function typeMessage(text, callback) {
    let i = 0;
    messageElement.textContent = "";
    function typing() {
        if (i < text.length) {
            messageElement.textContent += text.charAt(i);
            i++;
            setTimeout(typing, 50);
        } else if (callback) {
            callback();
        }
    }
    typing();
}

function nextMessage() {
    currentMessage++;
    if (currentMessage < messages.length - 1) {
        typeMessage(messages[currentMessage]);
        swapButtons();
    } else if (currentMessage === messages.length - 1) {
        finalSpill(messages[currentMessage]);
    }
}

function swapButtons() {
    if (Math.random() > 0.5) {
        yesBtn.parentNode.insertBefore(noBtn, yesBtn);
    } else {
        yesBtn.parentNode.insertBefore(yesBtn, noBtn);
    }
}

function finalSpill(text) {
    messageElement.textContent = "";
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    [...text].forEach((letter, index) => {
        const span = document.createElement("span");
        span.className = "letter";
        span.textContent = letter;
        span.style.left = `${centerX - (text.length*10)/2 + index * 20}px`;
        span.style.top = `${centerY}px`;
        span.style.setProperty("--rot", `${Math.random() * 60 - 30}deg`);

        document.body.appendChild(span);

        setTimeout(() => {
            const randomX = Math.random() * window.innerWidth;
            span.style.transition = "transform 2s ease-in, top 2s ease-in, left 2s ease-in";
            span.style.top = `${window.innerHeight - 40}px`;
            span.style.left = `${randomX}px`;
        }, index * 100);
    });
}

yesBtn.addEventListener("click", nextMessage);
noBtn.addEventListener("click", nextMessage);

// Show first message instantly
typeMessage(messages[currentMessage]);
