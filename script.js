document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chatBox");
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");

    // Load chat history from localStorage
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

    function renderChat() {
        chatBox.innerHTML = "";
        chatHistory.forEach(msg => {
            let messageElement = document.createElement("div");
            messageElement.classList.add("message");

            if (msg.sender === "You") {
                messageElement.classList.add("user-message");
            } else {
                messageElement.classList.add("bot-message");
            }

            messageElement.innerHTML = `<strong>${msg.sender}:</strong> ${msg.text}`;
            chatBox.appendChild(messageElement);
        });

        chatBox.scrollTop = chatBox.scrollHeight;
    }

    renderChat(); // Display previous chat messages

    sendButton.addEventListener("click", function () {
        const userMessage = userInput.value.trim();
        if (userMessage === "") return;

        // Add user message to chat
        chatHistory.push({ sender: "You", text: userMessage });
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
        renderChat();

        // Send message to backend webhook
        fetch("https://hook.eu2.make.com/your-webhook-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => response.json())
        .then(data => {
            if (data.reply) {
                chatHistory.push({ sender: "Bot", text: data.reply });
                localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
                renderChat();
            } else {
                chatHistory.push({ sender: "Bot", text: "Error: No response from AI" });
                renderChat();
            }
        })
        .catch(error => {
            chatHistory.push({ sender: "Bot", text: "Error connecting to AI. Try again." });
            renderChat();
        });

        userInput.value = ""; // Clear input box
    });
});
