function sendMessage() {
    let userInput = document.getElementById("userInput").value.trim();
    if (userInput === "") return;

    let chatBox = document.getElementById("chatBox");

    // Display User Message
    let userMessageDiv = document.createElement("div");
    userMessageDiv.classList.add("message", "user-message");
    userMessageDiv.innerHTML = `<strong>You:</strong> ${userInput}`;
    chatBox.appendChild(userMessageDiv);

    // Clear input field
    document.getElementById("userInput").value = "";

    // Simulate bot response
    setTimeout(() => {
        let botMessageDiv = document.createElement("div");
        botMessageDiv.classList.add("message", "bot-message");
        botMessageDiv.innerHTML = `<strong>Bot:</strong> This is a test response.`;
        chatBox.appendChild(botMessageDiv);

        // Auto-scroll to latest message
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
}

// Allow pressing "Enter" to send a message
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
