document.addEventListener("DOMContentLoaded", function () {
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");

    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        let userMessage = userInput.value.trim();
        if (userMessage === "") return;

        // Display user message in chatbox
        chatbox.innerHTML += `<div class="message user"><b>You:</b> ${userMessage}</div>`;
        userInput.value = "";
        chatbox.scrollTop = chatbox.scrollHeight;

        // Send message to webhook
        fetch("https://hook.eu2.make.com/58hy2sz57de23mg65laummt11gd5aje4", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => response.json())
        .then(data => {
            if (data.reply) {
                chatbox.innerHTML += `<div class="message bot"><b>Bot:</b> ${data.reply}</div>`;
                chatbox.scrollTop = chatbox.scrollHeight;
            } else {
                chatbox.innerHTML += `<div class="message bot error"><b>Bot:</b> Error connecting to AI. Try again.</div>`;
            }
        })
        .catch(error => {
            console.error("Error:", error);
            chatbox.innerHTML += `<div class="message bot error"><b>Bot:</b> Error connecting to AI. Try again.</div>`;
        });
    }
});
