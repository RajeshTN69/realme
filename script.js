let mediaRecorder;
let audioChunks = [];
let recognition;

// Set up event listeners
document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Call button functionality
document.getElementById('callButton').addEventListener('click', function() {
    const phoneNumber = "1234567890"; // Replace with the desired phone number
    window.location.href = `tel:${phoneNumber}`;
});

// File upload functionality
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            const timestamp = getCurrentTime();
            displayImage(imageUrl, 'sent', timestamp);
        };
        reader.readAsDataURL(file);
        event.target.value = ''; // Reset the input after sending
    }
});

// Voice recording functionality
document.getElementById('recordButton').addEventListener('click', startRecording);
document.getElementById('stopButton').addEventListener('click', stopRecording);

// Initialize voice recognition
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('messageInput').value = transcript; // Set the input to the spoken text
        sendMessage(); // Send the message automatically
    };

    recognition.onend = function() {
        console.log('Voice recognition ended.');
    };

    recognition.onerror = function(event) {
        console.error('Recognition error:', event.error);
        alert('There was an error with voice recognition: ' + event.error);
    };

    document.getElementById('voiceButton').addEventListener('click', function() {
        recognition.start(); // Start voice recognition
        console.log('Voice recognition started. Speak now.');
    });
}

// Greet user on load
window.onload = greetUser;

// Send message function
function sendMessage() {
    const input = document.getElementById('messageInput');
    const messageText = input.value.trim();

    if (messageText) {
        const timestamp = getCurrentTime();

        // Check for mathematical calculations
        const mathResult = evaluateMathExpression(messageText);
        if (mathResult !== null) {
            displayMessage(`Result: ${mathResult}`, 'received', timestamp);
            input.value = ''; // Clear input after sending
            return;
        }

        // Check for photo requests
        if (messageText.toLowerCase().includes("send photo of rajesh")) {
            const imageUrl = 'download.png'; // URL of the image to send
            displayImage(imageUrl, 'received', timestamp);
        } else if (messageText.toLowerCase().includes("send photo of app store")) {
            const imageUrl = 'app-store.png'; // URL of the image to send
            displayImage(imageUrl, 'received', timestamp);
        } else if (messageText.toLowerCase().includes("send photo of youtube")) {
            const imageUrl = 'youtube.png'; // URL of the image to send
            displayImage(imageUrl, 'received', timestamp);
        } else {
            displayMessage(messageText, 'sent', timestamp);

            // Simulate AI response
            setTimeout(() => {
                const aiResponse = getAIResponse(messageText);
                displayMessage(aiResponse, 'received', getCurrentTime());
            }, 1000);
        }
        input.value = ''; // Clear input after sending
    }
}

function greetUser() {
    const initialMessage = "Hi!";
    const timestamp = getCurrentTime();
    displayMessage(initialMessage, 'received', timestamp);
    speak(initialMessage); // Speak the greeting
}

function displayMessage(text, type, timestamp) {
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    
    // Add message text
    messageElement.textContent = text;

    // Add timestamp
    const timestampElement = document.createElement('div');
    timestampElement.className = 'timestamp';
    timestampElement.textContent = timestamp;
    messageElement.appendChild(timestampElement);

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll
}

function displayImage(src, type, timestamp) {
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;

    // Add image
    const imgElement = document.createElement('img');
    imgElement.src = src;
    imgElement.style.maxWidth = '200px'; // Set max width for images
    imgElement.style.borderRadius = '5px'; // Optional styling
    messageElement.appendChild(imgElement);

    // Add timestamp
    const timestampElement = document.createElement('div');
    timestampElement.className = 'timestamp';
    timestampElement.textContent = timestamp;
    messageElement.appendChild(timestampElement);

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll
}

// AI response logic
function getAIResponse(userMessage) {
    const responses = {
        "hello": "Hi there! How can I assist you?",
        "how are you?": "I'm just a program, but I'm doing well!",
        "bye": "Goodbye! Have a nice day!",
        "help": "What do you need help with?",
        "default": "I'm not sure how to respond to that.",
        'who is the founder of you':'i will created by Rajesh sir',
'tell about rajesh':'plese mention sir after rajesh',
'tell about rajesh sir':'His full name is Rajesh Pandi.His father name is Arumuga pandi,his mother name is Kovil Thangam.He studying 12th std',
'sex':'sorry i can not assist you about this ',
'help me for calculations':'ok i can help you in calculations .ask some questions?',
'who is your favirote actor':'my favirote actor is thalapathy vijay',
'tell about thalapathy vijay':'His full name is Joseph Vijay.His father name is S.A.Chandra sekar,his mother name is sobha.He is actor,singer,dancer and leader of Tamilga vettri kalagam.He is one of the most popular actor in India and Tamil nadu'
,
'what is your name':'I was named as Pheniox by rajesh',
'tell about you':'I will created by Rajesh sir on 28.9.2024.I will assist users like a friend.My nation is India.'
,
'best gaming phone in the world':'Asus rog 8 phone',
'i love you':'oops!.i was a machine.not a human being',
'I Love You ':'oops!.i was a machine.not a human being',
'I love you':'oops!.i was a machine.not a human being',
'I LOVE YOU':'oops!.i was a machine.not a human being',
'saaptiya':'I could not eat anything.Because i am machine',
'tell more':'I will search about this.But is not available in my storage.please ask another',
'helo':'add 1 l',
'helol':'wrong type',
'what is css':'css is castcating style sheet',
'tell about css':'css is used in html for developing the webpage more attractive like color ful and mordern.',
'tell about java script':'java script is used for adding many functions to trigger the functions you will defined.',
'tell about me':"sorry i did't know about you",
'hi':'already i sayed hi!.But once hi! for you',
'help me for calculations':'Yeah i will help you in calculations.Ask ques?',
'i want to study python for free':'Go to youtube and search python full course for free with menioning your langauge',
'which langauge is most toughest langauge in India':'Malayalam is  the most toughest langauge in India ',
'best ai in the world':'Peniox is the best ai in the world'
    };

    const normalizedMessage = userMessage.toLowerCase();
    return responses[normalizedMessage] || responses["default"];
}

// Function to get the current date and time
function getCurrentTime() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const time = now.toLocaleTimeString([], options);
    const date = now.toLocaleDateString();
    return `${date} ${time}`;
}

// Voice recording functions
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const timestamp = getCurrentTime();
            displayAudio(audioUrl, 'sent', timestamp);
            audioChunks = []; // Reset for the next recording
        };

        mediaRecorder.start();
        console.log("Recording started...");
    } catch (error) {
        console.error("Error accessing microphone: ", error);
        alert("Could not start recording. Please check your microphone permissions.");
    }
}

function stopRecording() {
    mediaRecorder.stop();
}

function displayAudio(src, type, timestamp) {
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;

    // Add audio element
    const audioElement = document.createElement('audio');
    audioElement.controls = true;
    audioElement.src = src;
    messageElement.appendChild(audioElement);

    // Add timestamp
    const timestampElement = document.createElement('div');
    timestampElement.className = 'timestamp';
    timestampElement.textContent = timestamp;
    messageElement.appendChild(timestampElement);

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll
}

// Function to make the machine speak
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get the available voices
    const voices = speechSynthesis.getVoices();
    
    // Find a female voice
    const femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('Google UK English Female'));

    // Set the voice if a female voice is found
    if (femaleVoice) {
        utterance.voice = femaleVoice;
    }

    speechSynthesis.speak(utterance);
}

// Add an event listener to populate the voices when they are loaded
speechSynthesis.onvoiceschanged = () => {
    // This ensures that the voices are available when the user clicks the voice button
    const voices = speechSynthesis.getVoices();
    console.log(voices); // Log available voices for debugging
};

// Function to evaluate mathematical expressions (to be implemented)
function evaluateMathExpression(expression) {
    try {
        // Remove any unwanted characters but allow basic arithmetic operators
        const sanitizedExpression = expression.replace(/[^-()\d/*+.]/g, '');

        // Evaluate the sanitized expression using eval()
        const result = eval(sanitizedExpression);

        // Return the result, ensuring it's a finite number
        return (typeof result === 'number' && isFinite(result)) ? result : null;
    } catch (error) {
        return null; // Return null if the expression is invalid
    }
}

