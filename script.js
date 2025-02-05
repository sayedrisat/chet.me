async function sendMessage() {
    let userInput = document.getElementById("userInput").value;
    if (!userInput.trim()) return; // Prevent empty messages

    document.getElementById("chatbox").innerHTML += `<div class='user-message'>You: ${userInput}</div>`;

    // Clear input field
    document.getElementById("userInput").value = "";

    try {
        let response = await fetch("YOUR_WEBHOOK_URL", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userInput }),
        });

        if (!response.ok) {
            throw new Error("Error connecting to AI.");
        }

        let data = await response.json();

        // Ensure we received a valid reply
        let botReply = data.reply || "I'm sorry, I didn't get that.";
        
        document.getElementById("chatbox").innerHTML += `<div class='bot-message'>Bot: ${botReply}</div>`;
    } catch (error) {
        document.getElementById("chatbox").innerHTML += `<div class='bot-message error'>Bot: ${error.message}. Try again.</div>`;
    }
}
