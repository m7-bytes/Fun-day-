// Messages with text color, background color, and optional confetti
const messages = [
    { text: "Hey there! 👋 What brings you here today?", textColor: "#333", bgColor: "#FFFAE3" },
    { text: "Click the arrow... I’ve got something to show you 😉", textColor: "#555", bgColor: "#E3F2FD" },
    { text: "You clicked! You’re officially curious 🤓", textColor: "#0066cc", bgColor: "#FFF0F5" },
    { text: "Want to hear a fun fact? ➡", textColor: "#cc6600", bgColor: "#FFF5E1" },
    { text: "Bananas are berries, but strawberries aren’t! 🍌🍓", textColor: "#ff6600", bgColor: "#FFFACD" },
    { text: "Now your turn... what’s your favorite fruit? 🍍", textColor: "#cc00cc", bgColor: "#FCE4EC" },
    { text: "Imagine this: You’re on a beach 🏖 with a coconut drink 🥥", textColor: "#009999", bgColor: "#E0F7FA" },
    { text: "Feels nice, right? 🌊", textColor: "#0066ff", bgColor: "#E3F2FD" },
    { text: "Okay, time for a quick challenge...", textColor: "#cc0000", bgColor: "#FFEBEE" },
    { text: "Count backwards from 5 in your head... Ready? Go! ⏳", textColor: "#000", bgColor: "#F5F5F5" },
    { text: "5️⃣ 4️⃣ 3️⃣ 2️⃣ 1️⃣ 🎉", textColor: "#ff00ff", bgColor: "#E1BEE7", confetti: true },
    { text: "Congratulations, you passed the challenge! 🏆", textColor: "#009900", bgColor: "#E8F5E9", confetti: true },
    { text: "Do you want to see a random compliment? ➡", textColor: "#444", bgColor: "#F3E5F5" },
    { text: "You have great taste in websites 😉", textColor: "#ff3399", bgColor: "#FFEBF0" },
    { text: "Okay, I’ll stop now... or should I? 🤔", textColor: "#333", bgColor: "#FFF8E1" },
    { text: "One last click to see something special...", textColor: "#666", bgColor: "#E0F2F1" },
    { text: "⭐ You’re awesome. Don’t forget that. ⭐", textColor: "#ffaa00", bgColor: "#FFF3E0", confetti: true }
];

let index = 0;
const messageEl = document.getElementById("message");
const nextBtn = document.getElementById("nextBtn");

function showMessage() {
    const current = messages[index];
    
    // Fade out
    messageEl.style.opacity = 0;
    setTimeout(() => {
        // Update text, color, and background
        messageEl.textContent = current.text;
        messageEl.style.color = current.textColor || "#333";
        document.body.style.backgroundColor = current.bgColor || "#f5f5f5";
        
        // Fade in
        messageEl.style.opacity = 1;

        // If confetti is set, play it
        if (current.confetti) {
            confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.6 }
            });
        }
    }, 300);

    // Move to next message (loop)
    index = (index + 1) % messages.length;
}

nextBtn.addEventListener("click", showMessage);
