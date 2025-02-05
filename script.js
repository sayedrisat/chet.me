document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chatBox");
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");

    // Load previous chat history from local storage
    function loadChatHistory() {
        const chatHistory = localStorage.getItem("chatHistory");
        if (chatHistory) {
            chatBox.innerHTML = chatHistory;
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    // Save chat history in local storage
    function saveChatHistory() {
        localStorage.setItem("chatHistory", chatBox.innerHTML);
    }

    // Function to add messages to the chat
    function addMessageToChat(sender, message) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.classList.add(sender === "You" ? "user-message" : "bot-message");
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        saveChatHistory();
    }

    // Function to send user input to webhook
    function sendMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        // Display user message in chat
        addMessageToChat("You", userMessage);

        // Send message to webhook
        fetch("https://hook.eu2.make.com/your-webhook-url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Webhook Response:", data); // Debugging

            if (data && data.reply) {
                addMessageToChat("Bot", data.reply);
            } else {
                addMessageToChat("Bot", "Error: No response from AI.");
            }
        })
        .catch(error => {
            addMessageToChat("Bot", "Error connecting to AI. Try again.");
            console.error("Error:", error);
        });

        // Clear input field
        userInput.value = "";
    }

    // Event Listener for Send Button
    sendButton.addEventListener("click", sendMessage);

    // Event Listener for Enter Key Press
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // Load previous chat history on page load
    loadChatHistory();
});
