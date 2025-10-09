const JOKE_API = "https://official-joke-api.appspot.com/random_joke";

const jokeQuestionDiv = document.getElementById('joke-question');
const jokeAnswerDiv = document.getElementById('joke-answer');
const jokeRestrictionsDiv = document.getElementById('joke-restrictions');

window.document.addEventListener("DOMContentLoaded", () => {
    let i = 0; // Start letter index
    let jokeQuestion = '';
    let jokeAnswer = '';
    let speed = 50; // The speed/duration of the effect in milliseconds
    let isTyping = false; // Flag to prevent multiple simultaneous jokes

    // Rate limiting variables
    const MAX_JOKES_PER_MINUTE = 10;
    const TIME_WINDOW = 60000; // 1 minute in milliseconds
    let jokeTimestamps = [];

    const generateJokeBtn = document.getElementById("generate-joke");
    if (generateJokeBtn) {
        generateJokeBtn.addEventListener("click", handleJokeRequest);
    }

    // Initialize restrictions display
    updateRestrictionsDisplay();

    function handleJokeRequest() {
        // Prevent multiple jokes from being generated simultaneously
        if (isTyping) {
            return;
        }

        const now = Date.now();

        // Remove timestamps older than 1 minute
        jokeTimestamps = jokeTimestamps.filter(timestamp => now - timestamp < TIME_WINDOW);

        // Check if limit reached
        if (jokeTimestamps.length >= MAX_JOKES_PER_MINUTE) {
            const oldestTimestamp = jokeTimestamps[0];
            const timeToWait = TIME_WINDOW - (now - oldestTimestamp);
            const secondsToWait = Math.ceil(timeToWait / 1000);

            showRateLimitMessage(secondsToWait);
            return;
        }

        // Add current timestamp and fetch joke
        jokeTimestamps.push(now);
        updateRestrictionsDisplay();
        getJoke();
    }

    function updateRestrictionsDisplay() {
        const now = Date.now();
        // Clean up old timestamps
        jokeTimestamps = jokeTimestamps.filter(timestamp => now - timestamp < TIME_WINDOW);

        const jokesUsed = jokeTimestamps.length;
        const jokesRemaining = MAX_JOKES_PER_MINUTE - jokesUsed;

        jokeRestrictionsDiv.textContent = `Jokes remaining: ${jokesRemaining}/${MAX_JOKES_PER_MINUTE}`;
    }

    function showRateLimitMessage(seconds) {
        resetJoke();
        jokeQuestionDiv.innerHTML = `Rate limit reached! 🚫`;
        jokeAnswerDiv.innerHTML = `Please wait ${seconds} seconds before requesting another joke.`;

        // Disable button temporarily
        generateJokeBtn.disabled = true;
        generateJokeBtn.style.opacity = '0.5';
        generateJokeBtn.style.cursor = 'not-allowed';

        setTimeout(() => {
            generateJokeBtn.disabled = false;
            generateJokeBtn.style.opacity = '1';
            generateJokeBtn.style.cursor = 'pointer';
            updateRestrictionsDisplay();
        }, seconds * 1000);
    }

    function getJoke() {
        isTyping = true; // Set flag to prevent double-clicking

        fetch(JOKE_API)
            .then(response => response.json())
            .then(data => {
                resetJoke();
                jokeQuestion = data.setup;
                jokeAnswer = data.punchline;
                setTimeout(typeQuestion, 300);
            })
            .catch(error => {
                console.error('Error fetching joke:', error);
                jokeQuestionDiv.innerHTML = 'Oops! Something went wrong.';
                jokeAnswerDiv.innerHTML = 'Please try again later.';
                isTyping = false; // Reset flag on error
            });
    }

    function typeQuestion() {
        if (i < jokeQuestion.length) {
            jokeQuestionDiv.innerHTML += jokeQuestion.charAt(i);
            i++;
            setTimeout(typeQuestion, speed);
        } else {
            i = 0;
            setTimeout(typeAnswer, 1000);
        }
    }

    function typeAnswer() {
        if (i < jokeAnswer.length) {
            jokeAnswerDiv.innerHTML += jokeAnswer.charAt(i);
            i++;
            setTimeout(typeAnswer, speed);
        } else {
            i = 0;
            isTyping = false; // Reset flag when typing is complete
        }
    }

    function resetJoke() {
        i = 0;
        jokeQuestionDiv.innerHTML = '';
        jokeAnswerDiv.innerHTML = '';
    }
});