document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

async function sendMessage() {
    let userInput = document.getElementById("userInput");
    let userMessage = userInput.value.trim();

    if (userMessage === "") return;

    let chatBox = document.getElementById("chatBox");
    
    // Show user message
    let userMsgDiv = document.createElement("div");
    userMsgDiv.className = "user-message";
    userMsgDiv.innerHTML = `<strong>You:</strong> ${userMessage}`;
    chatBox.appendChild(userMsgDiv);

    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // Show typing animation
    let typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator";
    typingIndicator.innerHTML = `<span></span><span></span><span></span>`;
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        let response = await fetch("https://hook.eu2.make.com/58hy2sz57de23mg65laummt11gd5aje4", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let textResponse = await response.text();
        let data;

        try {
            data = JSON.parse(textResponse);
        } catch (jsonError) {
            console.warn("Response is not JSON, attempting manual conversion:", textResponse);
            textResponse = textResponse.replace(/\n/g, " ").replace(/\t/g, " ").trim(); // Clean text
            try {
                data = JSON.parse(textResponse);
            } catch (finalError) {
                throw new Error("Final attempt failed: Invalid JSON format received from API");
            }
        }

        console.log("API Response (Parsed):", data);
        
        let botReply = (typeof data === "object" && data.reply) ? data.reply : "Sorry, I couldn't generate a response.";

        chatBox.removeChild(typingIndicator);

        let botMsgDiv = document.createElement("div");
        botMsgDiv.className = "bot-message";
        botMsgDiv.innerHTML = `<img src="logo.png" class="bot-avatar"> <strong>Bot:</strong> ${botReply}`;
        chatBox.appendChild(botMsgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error("Error connecting to AI:", error);
        chatBox.removeChild(typingIndicator);
        let errorMsgDiv = document.createElement("div");
        errorMsgDiv.className = "bot-message";
        errorMsgDiv.innerHTML = `<img src="logo.png" class="bot-avatar"> <strong>Bot:</strong> Connection error. Try again later.`;
        chatBox.appendChild(errorMsgDiv);
    }
}
