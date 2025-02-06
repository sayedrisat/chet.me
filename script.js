document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function closePopup() {
    document.getElementById("telegramPopup").style.display = "none";
}

async function sendMessage() {
    let userMessage = document.getElementById("userInput").value;
    if (userMessage.trim() === "") return;

    let chatBox = document.getElementById("chatBox");

    // Display user message
    chatBox.innerHTML += `<div class="user-message"><strong>You:</strong> ${userMessage}</div>`;

    document.getElementById("userInput").value = ""; // Clear input field
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message

    // Show typing animation
    let typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator";
    typingIndicator.innerHTML = `<span></span><span></span><span></span>`;
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        let response = await fetch("https://hook.eu2.make.com/58hy2sz57de23mg65laummt11gd5aje4", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });

        let data = await response.json();
        let botReply = data.reply || "Sorry, I couldn't generate a response.";

        // Remove typing indicator
        chatBox.removeChild(typingIndicator);

        // Display bot response with profile logo
        chatBox.innerHTML += `<div class="bot-message">
            <img src="bot-logo.png" class="bot-logo">
            <strong>Bot:</strong> ${botReply}
        </div>`;
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
    } catch (error) {
        chatBox.removeChild(typingIndicator);
        chatBox.innerHTML += `<div class="bot-message"><strong>Bot:</strong> Error connecting to AI.</div>`;
    }
}
