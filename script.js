const messages = [
    "Hey Sana! 👋 Ready for something fun?",
    "Do you like surprises? 🎁",
    "Would you click Yes if I asked nicely? 😏",
    "Are you still with me?",
    "Quick! Count backwards: 3... 2... 1...",
    "Final question... ready?",
    "Here comes the grand finale 💦",
    "You Successfully wasted 30 seconds on this stupid page 🤪"
];

let currentMessage = 0;
let noClicks = 0;

const messageEl = document.getElementById('message');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const popup = document.getElementById('popup');

function typeMessage(text, callback) {
    let i = 0;
    messageEl.innerHTML = "";
    function type() {
        if (i < text.length) {
            messageEl.innerHTML += text[i];
            i++;
            setTimeout(type, 40);
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

function showPopup() {
    popup.style.display = "block";
    popup.style.animation = "slideDown 0.4s ease forwards";
    setTimeout(() => {
        popup.style.display = "none";
        nextMessage();
    }, 2000);
}

function spillLetters() {
    const finalText = "SPLASH!";
    messageEl.innerHTML = "";
    for (let char of finalText) {
        const letter = document.createElement('div');
        letter.classList.add('falling-letter');
        letter.textContent = char;
        letter.style.left = Math.random() * window.innerWidth + "px";
        letter.style.color = `hsl(${Math.random()*360}, 80%, 70%)`;
        letter.style.top = "-50px";
        document.body.appendChild(letter);

        let velocity = 3 + Math.random() * 2;
        let y = -50;
        let gravity = 0.2;
        let bounce = 0.4;
        const floor = window.innerHeight - 60;

        const fall = setInterval(() => {
            velocity += gravity;
            y += velocity;
            if (y >= floor) {
                velocity *= -bounce;
                y = floor;
                if (Math.abs(velocity) < 0.5) {
                    clearInterval(fall);
                }
            }
            letter.style.top = y + "px";
        }, 16);
    }
}

function confettiBurst() {
    for (let i = 0; i < 15; i++) {
        const confetti = document.createElement('div');
        confetti.textContent = "🎉";
        confetti.style.position = "absolute";
        confetti.style.left = Math.random() * window.innerWidth + "px";
        confetti.style.top = "-50px";
        confetti.style.fontSize = "1.5rem";
        document.body.appendChild(confetti);
        let y = -50;
        const drop = setInterval(() => {
            y += 4;
            confetti.style.top = y + "px";
            if (y > window.innerHeight) {
                confetti.remove();
                clearInterval(drop);
            }
        }, 16);
    }
}

yesBtn.addEventListener('click', () => {
    confettiBurst();
    noClicks = 0;
    nextMessage();
});

noBtn.addEventListener('click', () => {
    noClicks++;
    if (noClicks === 3) {
        noClicks = 0;
        showPopup();
    } else {
        nextMessage();
    }
});

// Start game
nextMessage();
