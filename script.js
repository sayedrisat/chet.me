document.getElementById("sendButton").addEventListener("click", function () {
    let userInput = document.getElementById("userInput").value.trim();
    if (userInput === "") return; // Avoid empty messages

    let chatBox = document.getElementById("chatBox");
    chatBox.innerHTML += `<div class="message user"><b>You:</b> ${userInput}</div>`;

    // Correct Fetch Request
    fetch("YOUR_WEBHOOK_URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => response.json())
    .then(data => {
        chatBox.innerHTML += `<div class="message bot"><b>Bot:</b> ${data.reply}</div>`;
    })
    .catch(error => {
        console.error("Error:", error);
        chatBox.innerHTML += `<div class="message bot"><b>Bot:</b> Error connecting to AI.</div>`;
    });

    document.getElementById("userInput").value = ""; // Clear input
});
