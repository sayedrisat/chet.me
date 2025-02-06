document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

async function sendMessage() {
    let userMessage = document.getElementById("userInput").value;
    if (userMessage.trim() === "") return;

    let chatBox = document.getElementById("chatBox");
    chatBox.innerHTML += `<div class="user-message"><strong>You:</strong> ${userMessage}</div>`;

    document.getElementById("userInput").value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    let typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator";
    typingIndicator.innerHTML = `<span></span><span></span><span></span>`;
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        let response = await fetch("https://hook.eu2.make.com/58hy2sz57de23mg65laummt11gd5aje4", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });

        let data = await response.json();
        let botReply = data.reply || "Sorry, I couldn't generate a response.";

        chatBox.removeChild(typingIndicator);
        chatBox.innerHTML += `<div class="bot-message"><img src="logo.png" class="bot-avatar"> <strong>Bot:</strong> ${botReply}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        chatBox.removeChild(typingIndicator);
        chatBox.innerHTML += `<
