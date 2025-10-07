const JOKE_API= "https://official-joke-api.appspot.com/random_joke";

const jokeQuestionDiv = document.getElementById('joke-question');
const jokeAnswerDiv = document.getElementById('joke-answer');

window.document.addEventListener("DOMContentLoaded", () => {
    let i = 0; // Start letter index
    let jokeQuestion = '';
    let jokeAnswer = '';
    let speed = 50; // The speed/duration of the effect in milliseconds

    const generateJokeBtn = document.getElementById("generate-joke");
    if (generateJokeBtn) {
        generateJokeBtn.addEventListener("click", getJoke);
    }

    function getJoke() {
        fetch(JOKE_API)
            .then(response => response.json())
            .then(data => {
                resetJoke();
                jokeQuestion = data.setup
                jokeAnswer = data.punchline;
                setTimeout(typeQuestion, 300)
            })
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
        }
    }

    function resetJoke() {
        i = 0;
        jokeQuestionDiv.innerHTML = '';
        jokeAnswerDiv.innerHTML = '';
    }
})