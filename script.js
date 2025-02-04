async function sendMessage() {
    let userMessage = document.getElementById("userInput").value;
    if (userMessage.trim() === "") return;

    let chatBox = document.getElementById("chatBox");

    // Display user message
    chatBox.innerHTML += `<div class="user-message"><strong>You:</strong> ${userMessage}</div>`;

    document.getElementById("userInput").value = ""; // Clear input field
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message

    try {
        let response = await fetch("https://hook.eu2.make.com/58hy2sz57de23mg65laummt11gd5aje4", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });

        let data = await response.json();
        let botReply = data.reply || "Sorry, I couldn't generate a response.";

        // Display bot response
        chatBox.innerHTML += `<div class="bot-message"><strong>Bot:</strong> ${botReply}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
    } catch (error) {
        chatBox.innerHTML += `<div class="bot-message"><strong>Bot:</strong> Error connecting to AI.</div>`;
    }
}
