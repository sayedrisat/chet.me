document.addEventListener("DOMContentLoaded", function () {
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");

    loadChatHistory();

    function sendMessage() {
        let userText = userInput.value.trim();
        if (userText === "") return;

        // Ensure message length is within the limit
        if (userText.length > 250) {
            appendMessage("Bot", "⚠️ Your message is too long! Please keep it under 250 characters.", false);
            return;
        }

        appendMessage("You", userText, true);
        saveMessage("You", userText);
        userInput.value = "";
        userInput.focus();

        // **Fetch Request with Debugging**
        fetch("https://hook.eu2.make.com/58hy2sz57de23mg65laummt11gd5aje4", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userText })
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to get response from AI.");
            return response.json();
        })
        .then(data => {
            console.log("Webhook Response:", data); // Debugging log
            let botReply = data && data.reply ? data.reply : "Error: No response from AI.";
            appendMessage("Bot", botReply, false);
            saveMessage("Bot", botReply);
        })
        .catch(error => {
            console.error("Error:", error);
            appendMessage("Bot", "Error connecting to AI. Try again.", false);
        });
    }

    function appendMessage(sender, text, isUser) {
        let messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.classList.add(isUser ? "user-message" : "bot-message");

        let senderElement = document.createElement("strong");
        senderElement.textContent = sender + ": ";
        messageElement.appendChild(senderElement);

        let textElement = document.createElement("span");
        textElement.textContent = text;
        messageElement.appendChild(textElement);

        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    function saveMessage(sender, text) {
        let messages = JSON.parse(localStorage.getItem("chatHistory")) || [];
        messages.push({ sender, text });
        localStorage.setItem("chatHistory", JSON.stringify(messages));
    }

    function loadChatHistory() {
        let messages = JSON.parse(localStorage.getItem("chatHistory")) || [];
        chatbox.innerHTML = "";
        messages.forEach(msg => appendMessage(msg.sender, msg.text, msg.sender === "You"));
    }

    sendButton.addEventListener("click", function (event) {
        event.preventDefault();
        sendMessage();
    });

    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter" || event.keyCode === 13) {
            event.preventDefault();
            sendMessage();
        }
    });
});
