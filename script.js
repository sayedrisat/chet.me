document.addEventListener("DOMContentLoaded", function () {
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");

    // Ensure click event works across all devices
    sendButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevents any default form submission
        sendMessage();
    });

    // Handle Enter keypress for desktop and mobile keyboards
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter" || event.keyCode === 13) {
            event.preventDefault(); // Prevents newline in input field
            sendMessage();
        }
    });

    async function sendMessage() {
        let userText = userInput.value.trim();
        if (userText === "") return;

        // Append user message to chatbox
        appendMessage("You", userText, true);
        userInput.value = "";

        try {
            let response = await fetch("https://hook.eu2.make.com/58hy2sz57de23mg65laummt11gd5aje4", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: userText })
            });

            if (!response.ok) {
                throw new Error("Failed to get response from AI.");
            }

            let data = await response.json();

            if (data.reply) {
                appendMessage("Bot", data.reply, false);
            } else {
                appendMessage("Bot", "Error: No response from AI.", false);
            }
        } catch (error) {
            console.error("Error:", error);
            appendMessage("Bot", "Error connecting to AI.", false);
        }
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
});
