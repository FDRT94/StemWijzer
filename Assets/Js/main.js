const introContainer = document.getElementById("intro-container")
const questionContainer = document.getElementById("question-container")
const resultContainer = document.getElementById("result-container")
const title = document.getElementById("title")
const statement = document.getElementById("statement")

var answers = []
var partyCount = []

window.onload = function () {
    document.getElementById("intro-question-count").innerText = subjects.length
    
    document.getElementById("start-btn").onclick = function () {
        answers = []
        partyCount = []

        questionContainer.classList.toggle("d-none")
        introContainer.classList.toggle("d-none")

        loadQuestion(0);
    }

    document.getElementById("pro-btn").onclick = function () {
        answerAndContinue("pro")
    }
    document.getElementById("ambivalent-btn").onclick = function () {
        answerAndContinue("ambivalent")
    }
    document.getElementById("contra-btn").onclick = function () {
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

        questionContainer.classList.toggle("d-none")
        introContainer.classList.toggle("d-none")

        if (index < (subjects.length)) {
            loadQuestion(index)
        } else {
            calculateResult()
        }
    }
}

function loadQuestion(index) {
    questionContainer.setAttribute("data-question-index", index)
    title.innerText = index + 1 + ". " + subjects[index].title
    statement.innerText = subjects[index].statement
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
    sessionStorage.setItem("currentIndex", subjects.length + 1)
    for (let i = 0; i < answers.length; i++) {
        var answer = answers[i];

        var parties = subjects[answer.index].parties.filter(x => x.position == answer.position)

        for (let j = 0; j < parties.length; j++) {
            var party = parties[j];

            var index = partyCount.findIndex(x => x.name == party.name)

            if (index < 0) {
                partyCount.push({
                    name: party.name,
                    count: 1,
                    percentage: Math.round((1 / subjects.length) * 100)
                })
            } else {
                partyCount[index].count++;
                partyCount[index].percentage = Math.round((partyCount[index].count / subjects.length) * 100)
            }
        }
    }

    partyCount.sort(function (a, b) {
        return b.count - a.count;
    });

    showResult();
}

function showResult() {
    const first = document.getElementById("first")
    const second = document.getElementById("second")
    const third = document.getElementById("third")
    const ranking = document.getElementById("ranking")

    first.innerText = partyCount[0].name + " - " + partyCount[0].percentage + "%"
    second.innerText = partyCount[1].name + " - " + partyCount[1].percentage + "%"
    third.innerText = partyCount[2].name + " - " + partyCount[2].percentage + "%"

    for (let i = 3; i < partyCount.length; i++) {
        ranking.innerHTML += '<li class="list-group-item"><img src="Assets/Images/Parties/' + partyCount[i].name.replace(/\s+/g, ''); + '.png"></img>' + partyCount[i].name + ' - ' + partyCount[i].percentage + '%</li>'
    }

    resultContainer.classList.toggle("d-none")
    questionContainer.classList.toggle("d-none")
}