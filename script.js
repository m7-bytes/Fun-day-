const messages = [
    { text: "Hey there! 👋 What brings you here today?", bgColor: "#FFFAE3" },
    { text: "Click Yes or No... it doesn’t matter 😉", bgColor: "#E3F2FD" },
    { text: "You clicked! You’re officially curious 🤓", bgColor: "#FFF0F5" },
    { text: "Want to hear a fun fact? ➡", bgColor: "#FFF5E1" },
    { text: "Bananas are berries, but strawberries aren’t! 🍌🍓", bgColor: "#FFFACD" },
    { text: "Now your turn... what’s your favorite fruit? 🍍", bgColor: "#FCE4EC" },
    { text: "Imagine this: You’re on a beach 🏖 with a coconut drink 🥥", bgColor: "#E0F7FA" },
    { text: "Feels nice, right? 🌊", bgColor: "#E3F2FD" },
    { text: "Okay, time for a quick challenge...", bgColor: "#FFEBEE" },
    { text: "Count backwards from 5 in your head... Ready? Go! ⏳", bgColor: "#F5F5F5" },
    { text: "5️⃣ 4️⃣ 3️⃣ 2️⃣ 1️⃣ 🎉", bgColor: "#E1BEE7", confetti: true },
    { text: "Congratulations, you passed the challenge! 🏆", bgColor: "#E8F5E9", confetti: true },
    { text: "Do you want to see a random compliment? ➡", bgColor: "#F3E5F5" },
    { text: "You have great taste in websites 😉", bgColor: "#FFEBF0" },
    { text: "Okay, I’ll stop now... or should I? 🤔", bgColor: "#FFF8E1" },
    { text: "One last click to see something special...", bgColor: "#E0F2F1" },
    { text: "⭐ You’re awesome. Don’t forget that. ⭐", bgColor: "#FFF3E0", confetti: true, final: true }
];

let index = 0;
let noCount = 0;
const messageEl = document.getElementById("message");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

function typeMessage(message, callback) {
    messageEl.innerHTML = "";
    messageEl.style.opacity = 1;
    let i = 0;

    function typing() {
        if (i < message.length) {
            messageEl.innerHTML += message[i];
            i++;
            setTimeout(typing, 40);
        } else if (callback) {
            callback();
        }
    }
    typing();
}

function showMessage() {
    const current = messages[index];
    document.body.style.backgroundColor = current.bgColor || "#f5f5f5";

    if (current.confetti) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }

    if (current.final) {
        // Water spill effect
        messageEl.innerHTML = "";
        current.text.split("").forEach((char, i) => {
            const span = document.createElement("span");
            span.textContent = char;
            span.classList.add("drop");
            span.style.animationDelay = `${i * 0.05}s`;
            messageEl.appendChild(span);
        });
        setTimeout(() => confetti({ particleCount: 150, spread: 100 }), 500);
    } else {
        typeMessage(current.text);
    }

    index = (index + 1) % messages.length;
}

function handleChoice(choice) {
    if (choice === "no") {
        noCount++;
        if (noCount === 3) {
            alert("You keep saying No... but we both know you mean Yes 😏");
            noCount = 0;
        }
    } else {
        noCount = 0;
    }

    // Swap buttons randomly
    if (Math.random() > 0.5) {
        const yesParent = yesBtn.parentNode;
        yesParent.insertBefore(noBtn, yesBtn);
    } else {
        const yesParent = yesBtn.parentNode;
        yesParent.insertBefore(yesBtn, noBtn);
    }

    showMessage();
}

yesBtn.addEventListener("click", () => handleChoice("yes"));
noBtn.addEventListener("click", () => handleChoice("no"));

// Show first message immediately
showMessage();
