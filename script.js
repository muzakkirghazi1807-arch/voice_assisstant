const statusText = document.getElementById("status");
const responseBox = document.getElementById("response");
const listenButton = document.getElementById("listenButton");
const commandForm = document.getElementById("commandForm");
const commandInput = document.getElementById("commandInput");

function speak(text) {
responseBox.textContent = text;


if (!("speechSynthesis" in window)) {
    statusText.textContent =
        "Your browser does not support speech synthesis.";
    return;
}

window.speechSynthesis.cancel();

const message = new SpeechSynthesisUtterance(text);
message.lang = "en-IN";
message.rate = 0.95;
message.pitch = 1;

message.onstart = function () {
    statusText.textContent = "Jarvis is speaking...";
};

message.onend = function () {
    statusText.textContent = "Ready.";
};

message.onerror = function (event) {
    statusText.textContent =
        "Speech error: " + event.error;
    console.error("Jarvis speech error:", event);
};

window.speechSynthesis.speak(message);

}

function openSearch(query) {
    const url =
        "https://www.google.com/search?q=" +
        encodeURIComponent(query);

    window.open(url, "_blank");
}

function handleCommand(input) {
    const command = input.toLowerCase().trim();

    if (command === "") {
        speak("Please enter a command.");
        return;
    }

    statusText.textContent = "Command received.";

    if (
        command.includes("hello") ||
        command.includes("hey jarvis") ||
        command.includes("hi jarvis")
    ) {
        speak("Hello! I am Jarvis. How can I help you?");
    }

    else if (
        command.includes("how are you")
    ) {
        speak("I am doing great! Thanks for asking.");
    }

    else if (
        command.includes("your name") ||
        command.includes("who are you")
    ) {
        speak("I am Jarvis, your personal browser assistant.");
    }

    else if (
        command.includes("time")
    ) {
        const now = new Date();

        speak("The current time is " +
            now.toLocaleTimeString());
    }

    else if (
        command.includes("date")
    ) {
        const today = new Date();

        speak("Today's date is " +
            today.toLocaleDateString());
    }

    else if (
        command.includes("open google")
    ) {
        speak("Opening Google.");

        window.open("https://www.google.com", "_blank");
    }

    else if (
        command.includes("open youtube")
    ) {
        speak("Opening YouTube.");

        window.open("https://www.youtube.com", "_blank");
    }

    else if (
        command.includes("open gmail")
    ) {
        speak("Opening Gmail.");

        window.open("https://mail.google.com", "_blank");
    }

    else if (
        command.startsWith("search for ")
    ) {
        const query = command.substring(11).trim();

        if (query) {
            speak("Searching Google for " + query);
            openSearch(query);
        } else {
            speak("Please tell me what you want to search for.");
        }
    }

    else if (
        command.startsWith("search ")
    ) {
        const query = command.substring(7).trim();

        if (query) {
            speak("Searching Google for " + query);
            openSearch(query);
        } else {
            speak("Please tell me what you want to search for.");
        }
    }

    else if (
        command.startsWith("wikipedia ")
    ) {
        const topic = command.substring(10).trim();

        if (topic) {
            speak("Searching Wikipedia for " + topic);

            window.open(
                "https://en.wikipedia.org/wiki/Special:Search?search=" +
                encodeURIComponent(topic),
                "_blank"
            );
        } else {
            speak("Please provide a Wikipedia topic.");
        }
    }

    else if (
        command === "help" ||
        command.includes("what can you do")
    ) {
        speak(
            "I can tell you the time and date, open Google, " +
            "YouTube and Gmail, search Google, and find Wikipedia topics."
        );
    }

    else if (
        command === "exit" ||
        command === "stop jarvis"
    ) {
        speak("Goodbye! You can return whenever you need me.");
    }

    else {
        speak("I will search Google for " + command);
        openSearch(command);
    }

    statusText.textContent = "Ready for your next command.";
}

commandForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const command = commandInput.value;

    handleCommand(command);

    commandInput.value = "";
});

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    listenButton.addEventListener("click", function () {
        statusText.textContent = "Listening...";

        try {
            recognition.start();
        } catch (error) {
            statusText.textContent =
                "Already listening. Please try again.";
        }
    });

    recognition.onresult = function (event) {
        const transcript =
            event.results[0][0].transcript;

        commandInput.value = transcript;

        handleCommand(transcript);
    };

    recognition.onerror = function (event) {
        statusText.textContent =
            "Voice error: " + event.error +
            ". Please try typing your command.";
    };

    recognition.onend = function () {
        statusText.textContent = "Ready.";
    };

} else {
    listenButton.disabled = true;

    statusText.textContent =
        "Voice recognition is not supported in this browser. Please type your commands.";
}