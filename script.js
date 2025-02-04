document.addEventListener("DOMContentLoaded", function () {
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");

    // 🔹 Load Previous Chat History on Page Load
    loadChatHistory();

    function sendMessage() {
        let userText = userInput.value.trim();
        if (userText === "") return;

        // Append user message to chatbox and save it
        appendMessage("You", userText, true);
        saveMessage("You", userText);
        userInput.value = "";
        userInput.focus();

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
            console.log("Webhook Response:", data);
            let botReply = data && data.reply ? data.reply : "Error: No response from AI.";
            appendMessage("Bot", botReply, false);
            saveMessage("Bot", botReply); // Save bot response
        })
        .catch(error => {
            console.error("Error:", error);
            let errorMessage = "Error connecting to AI.";
            appendMessage("Bot", errorMessage, false);
            saveMessage("Bot", errorMessage);
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

    // 🔹 Save Messages to LocalStorage
    function saveMessage(sender, text) {
        let messages = JSON.parse(localStorage.getItem("chatHistory")) || [];
        messages.push({ sender, text });
        localStorage.setItem("chatHistory", JSON.stringify(messages));
    }

    // 🔹 Load Previous Chat Messages from LocalStorage
    function loadChatHistory() {
        let messages = JSON.parse(localStorage.getItem("chatHistory")) || [];
        messages.forEach(msg => appendMessage(msg.sender, msg.text, msg.sender === "You"));
    }

    // **Fix for Send Button Click Not Working on Mobile**
    sendButton.addEventListener("click", function (event) {
        event.preventDefault();
        sendMessage();
    });

    // **Fix for Enter Key Not Sending Messages**
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter" || event.keyCode === 13) {
            event.preventDefault();
            sendMessage();
        }
    });
});
