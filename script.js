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

    async function sendMessage() {
        let userText = userInput.value.trim();
        if (userText === "") return;

        // Display user message in chat
        chatbox.innerHTML += `<div class="user-message"><strong>You:</strong> ${userText}</div>`;
        userInput.value = "";
        chatbox.scrollTop = chatbox.scrollHeight;

        try {
            let response = await fetch("https://hook.eu2.make.com/58hy2sz57de23mg65laummt11gd5aje4", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userText })
            });

            let data = await response.json();
            
            // Display AI response in chat
            chatbox.innerHTML += `<div class="bot-message"><strong>Bot:</strong> ${data.reply || "Error: No response"}</div>`;
            chatbox.scrollTop = chatbox.scrollHeight;

        } catch (error) {
            chatbox.innerHTML += `<div class="bot-message error"><strong>Bot:</strong> Sorry, something went wrong.</div>`;
            console.error("Error:", error);
        }
    }
});
