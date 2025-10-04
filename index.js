const JOKE_API= "https://official-joke-api.appspot.com/random_joke";

window.document.addEventListener("DOMContentLoaded", () => {
    const generateJokeBtn = document.getElementById("generate-joke");
    if (generateJokeBtn) {
        generateJokeBtn.addEventListener("click", getJoke);
    }
})

function getJoke() {
    fetch(JOKE_API)
        .then(response => response.json())
        .then(data => {
            document.getElementById('joke-question').innerText = "- " + data.setup;
            document.getElementById('joke-answer').innerText = "- " + data.punchline;
        })
}

getJoke();