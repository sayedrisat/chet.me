document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.getElementById("sendButton");
    const userInput = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");

    function addMessage(sender, message) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.innerHTML = `<b>${sender}:</b> ${message}`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
    }

    sendButton.addEventListener("click", function () {
        let userMessage = userInput.value.trim();

        if (userMessage === "") {
            alert("⚠️ Please enter a message before sending.");
            return;
        }

        addMessage("You", userMessage);
        userInput.value = ""; // Clear input box

        fetch("https://hook.eu2.make.com/your-webhook-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage }),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Webhook Response:", data);
            if (data.reply) {
                addMessage("Bot", data.reply);
            } else {
                addMessage("Bot", "No response from AI.");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            addMessage("Bot", "Error connecting to AI.");
        });
    });

    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendButton.click();
        }
    });
});
