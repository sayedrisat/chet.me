async function sendMessage() {
    let userText = document.getElementById("userInput").value;
    if (userText.trim() === "") return;

    let chatbox = document.getElementById("chatbox");
    chatbox.innerHTML += `<div class='message user'><strong>You:</strong> ${userText}</div>`;
    document.getElementById("userInput").value = "";

    try {
        let response = await fetch("https://hook.eu2.make.com/58hy2sz57de23mg65laummt11gd5aje4", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userText })
        });
        let data = await response.json();
        chatbox.innerHTML += `<div class='message bot'><strong>Bot:</strong> ${data.reply || "Error: No response"}</div>`;
    } catch (error) {
        chatbox.innerHTML += `<div class='message bot error'><strong>Bot:</strong> Failed to fetch response.</div>`;
    }
    chatbox.scrollTop = chatbox.scrollHeight;
}
