document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.getElementById("sendButton");
    const userInput = document.getElementById("userInput");

    sendButton.addEventListener("click", function () {
        alert("Send button clicked! Your message: " + userInput.value);
    });
});
