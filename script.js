document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chatBox");
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");

    // Load previous messages from localStorage
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

    function renderChat() {
        chatBox.innerHTML = "";
        chatHistory.forEach(msg => {
            let messageElement = document.createElement("div");
            messageElement.classList.add("message", msg.sender === "You" ? "user-message" : "bot-message");
            messageElement.innerHTML = `<strong>${msg.sender}:</strong> ${msg.text}`;
            chatBox.appendChild(messageElement);
        });

        chatBox.scrollTop = chatBox.scrollHeight;
    }

    renderChat(); // Load previous messages

    function sendMessage() {
        const userMessage = userInput.value.trim();
        if (userMessage === "") return;

        // Disable send button to prevent duplicate messages
        sendButton.disabled = true;
        sendButton.innerText = "Sending...";

        chatHistory.push({ sender: "You", text: userMessage });
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
        renderChat();

        // Send the message to Make.com Webhook
        fetch("https://hook.eu2.make.com/your-webhook-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => response.json())
        .then(data => {
            sendButton.disabled = false;
            sendButton.innerText = "Send";

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
            sendButton.disabled = false;
            sendButton.innerText = "Send";

            chatHistory.push({ sender: "Bot", text: "Error connecting to AI. Try again." });
            renderChat();
        });

        userInput.value = ""; // Clear input field
    }

    // **Fix: Ensure button click works**
    sendButton.addEventListener("click", sendMessage);

    // **Fix: Ensure "Enter" key works**
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });
});
