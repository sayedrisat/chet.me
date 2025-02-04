function sendMessage() {
    let userInput = document.getElementById("userInput").value.trim();
    if (userInput === "") return;

    let chatBox = document.getElementById("chatBox");

    let userMessage = `<div class="message user-message"><b>You:</b> ${userInput}</div>`;
    chatBox.innerHTML += userMessage;
    
    document.getElementById("userInput").value = "";

    setTimeout(() => {
        let botResponse = `<div class="message bot-message"><b>Bot:</b> This is a test response.</div>`;
        chatBox.innerHTML += botResponse;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
}
