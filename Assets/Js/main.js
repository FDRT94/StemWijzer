const introContainer = document.getElementById("intro-container")
const questionContainer = document.getElementById("question-container")
const resultContainer = document.getElementById("result-container")
const title = document.getElementById("title")
const statement = document.getElementById("statement")

const proBtn = document.getElementById("pro-btn")
const ambivalentBtn = document.getElementById("ambivalent-btn")
const contraBtn = document.getElementById("contra-btn")

const resetBtn = document.getElementById("reset-btn")

var answers = []

window.onload = function () {
    document.getElementById("intro-question-count").innerText = subjects.length

    document.getElementById("start-btn").onclick = function () {
        questionContainer.classList.toggle("d-none")
        introContainer.classList.toggle("d-none")
        resetBtn.classList.toggle("d-none")

        loadQuestion(0);
    }

    document.getElementById("back-btn").onclick = function () {
        var index = parseInt(questionContainer.getAttribute("data-question-index"))
        
        if (index == 0) {
            questionContainer.classList.toggle("d-none")
            introContainer.classList.toggle("d-none")
            resetBtn.classList.toggle("d-none")
            
            sessionStorage.setItem("currentIndex", -1)
        } else {
            loadQuestion(index - 1)
        }
    }
    
    resetBtn.onclick = function () {
        answers = []

        questionContainer.classList.add("d-none")
        resultContainer.classList.add("d-none")
        resetBtn.classList.add("d-none")

        introContainer.classList.toggle("d-none")
    }

    proBtn.onclick = function () {
        answerAndContinue("pro")
    }
    ambivalentBtn.onclick = function () {
        answerAndContinue("ambivalent")
    }
    contraBtn.onclick = function () {
        answerAndContinue("contra")
    }

    document.getElementById("skip-btn").onclick = function () {
        var index = parseInt(questionContainer.getAttribute("data-question-index"))

        if (index < (subjects.length - 1)) {
            loadQuestion(index + 1)
        } else {
            calculateResult()
        }
    }

    var currentIndex = sessionStorage.getItem("currentIndex")

    if (currentIndex !== null) {
        var index = parseInt(currentIndex);
        var _answers = sessionStorage.getItem("answers")
        if (_answers != null)
            answers = JSON.parse(_answers)

        if (index == -1) {
            introContainer.classList.toggle("d-none")
        } else {
            questionContainer.classList.toggle("d-none")
            resetBtn.classList.toggle("d-none")

            if (index < (subjects.length)) {
                loadQuestion(index)
            } else {
                calculateResult()
            }
        }

    } else {
        introContainer.classList.toggle("d-none")
    }
}

function loadQuestion(index) {
    questionContainer.setAttribute("data-question-index", index)
    title.innerHTML = "<b>" + (index + 1) + ". " + subjects[index].title + "</b>"
    statement.innerText = subjects[index].statement

    var answerIndex = answers.findIndex(x => x.index == index)
    setSelectedAnswer(answerIndex > -1 ? answers[answerIndex].position : "")

    sessionStorage.setItem("currentIndex", index)
}

function answerAndContinue(position) {
    var index = parseInt(questionContainer.getAttribute("data-question-index"))

    var answerIndex = answers.findIndex(x => x.index == index)
    if (answerIndex < 0) {
        answers.push({
            index: index,
            position: position
        })
    } else {
        answers[answerIndex].position = position
    }

    sessionStorage.setItem("answers", JSON.stringify(answers))

    if (index < (subjects.length - 1)) {
        loadQuestion(index + 1)
    } else {
        calculateResult()
    }
}

function calculateResult() {
    for (let i = 0; i < parties.length; i++) {
        parties[i].count = 0
        parties[i].percentage = 0
    }

    sessionStorage.setItem("currentIndex", subjects.length + 1)
    for (let i = 0; i < answers.length; i++) {
        var answer = answers[i];

        var stances = subjects[answer.index].parties.filter(x => x.position == answer.position)

        for (let j = 0; j < stances.length; j++) {
            let index = parties.findIndex(x => x.name == stances[j].name)

            parties[index].count++

            parties[index].percentage = Math.round((parties[index].count / subjects.length) * 100)
        }
    }

    parties.sort(function (a, b) {
        return b.count - a.count;
    });

    showResult();
}

function showResult() {
    const first = document.getElementById("first")
    const second = document.getElementById("second")
    const third = document.getElementById("third")
    const ranking = document.getElementById("ranking")

    first.innerText = parties[0].name + " - " + parties[0].percentage + "%"
    second.innerText = parties[1].name + " - " + parties[1].percentage + "%"
    third.innerText = parties[2].name + " - " + parties[2].percentage + "%"

    for (let i = 3; i < parties.length; i++) {
        ranking.innerHTML += '<li class="list-group-item bg-light"><img src="Assets/Images/Parties/' + parties[i].name.replace(/\s+/g, '') + '.png"></img>' + parties[i].name + ' - ' + parties[i].percentage + '%</li>'
    }

    resultContainer.classList.toggle("d-none")
    questionContainer.classList.toggle("d-none")
}

function setSelectedAnswer(position) {
    switch (position) {
        case "pro":
            proBtn.classList.replace("btn-secondary", "btn-primary")
            ambivalentBtn.classList.replace("btn-primary", "btn-secondary")
            contraBtn.classList.replace("btn-primary", "btn-secondary")
            break;
        case "ambivalent":
            proBtn.classList.replace("btn-primary", "btn-secondary")
            ambivalentBtn.classList.replace("btn-secondary", "btn-primary")
            contraBtn.classList.replace("btn-primary", "btn-secondary")
            break;
        case "contra":
            proBtn.classList.replace("btn-primary", "btn-secondary")
            ambivalentBtn.classList.replace("btn-primary", "btn-secondary")
            contraBtn.classList.replace("btn-secondary", "btn-primary")
            break;
        default:
            proBtn.classList.replace("btn-secondary", "btn-primary")
            ambivalentBtn.classList.replace("btn-secondary", "btn-primary")
            contraBtn.classList.replace("btn-secondary", "btn-primary")
            break;
    }
}