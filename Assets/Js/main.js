const introContainer = document.getElementById("intro-container")
const questionContainer = document.getElementById("question-container")
const resultContainer = document.getElementById("result-container")
const preferenceContainer = document.getElementById("preference-container");
const title = document.getElementById("title")
const statement = document.getElementById("statement")

const proBtn = document.getElementById("pro-btn")
const ambivalentBtn = document.getElementById("ambivalent-btn")
const contraBtn = document.getElementById("contra-btn")

const resetBtn = document.getElementById("reset-btn")

var answers = []
var preferredStatements = []

window.onload = function () {
    document.getElementById("intro-question-count").innerText = subjects.length

    document.getElementById("start-btn").onclick = function () {
        showContainer("question")

        loadQuestion(0);
    }

    document.getElementById("back-btn").onclick = function () {
        var index = parseInt(questionContainer.getAttribute("data-question-index"))

        if (index == 0) {
            showContainer("intro")

            sessionStorage.setItem("currentIndex", -1)
        } else {
            loadQuestion(index - 1)
        }
    }

    resetBtn.onclick = function () {
        answers = []

        showContainer("intro")
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

    document.getElementById("to-result-btn").onclick = function () {
        calculateResult();
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
        showPreferenceContainer()
    }
}

function showPreferenceContainer() {
    showContainer("preference")
    const preferredStatementContainer = document.getElementById("preferred-statements");

    preferredStatementContainer.innerHTML = "";
    preferredStatements = [];

    for(let i = 0; i < answers.length; i++) {
        var answer = answers[i];
        var subject = subjects[answer.index]

        preferredStatementContainer.innerHTML += '<div class="form-check form-check-inline p-2"><label class="form-check-label"><input class="form-check-input preferred-statement-checkbox" type="checkbox" value="' + answer.index + '">' + subject.title + '</label></div>'
    }

    const checkboxes = document.getElementsByClassName("preferred-statement-checkbox");

    for(let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].onclick = function() {
            if (this.checked) {
                preferredStatements.push(this.value)
            } else {
                var index = preferredStatements.indexOf(this.value);
 
                if (index > -1) {
                    arr.splice(index, 1);
                }
            }
        }
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
    
    ranking.innerHTML = "";
    for (let i = 3; i < parties.length; i++) {
        ranking.innerHTML += '<li class="list-group-item bg-light"><img src="Assets/Images/Parties/' + parties[i].name.replace(/\s+/g, '') + '.png"></img>' + parties[i].name + ' - ' + parties[i].percentage + '%</li>'
    }

    showContainer("result")
}

function setSelectedAnswer(position) {
    proBtn.classList.replace("btn-primary", "btn-secondary")
    ambivalentBtn.classList.replace("btn-primary", "btn-secondary")
    contraBtn.classList.replace("btn-primary", "btn-secondary")

    switch (position) {
        case "pro":
            proBtn.classList.replace("btn-secondary", "btn-primary")
            break;
        case "ambivalent":
            ambivalentBtn.classList.replace("btn-secondary", "btn-primary")
            break;
        case "contra":
            contraBtn.classList.replace("btn-secondary", "btn-primary")
            break;
        default:
            break;
    }
}

function showContainer(container) {
    introContainer.classList.add("d-none")
    questionContainer.classList.add("d-none")
    preferenceContainer.classList.add("d-none")
    resultContainer.classList.add("d-none")
    resetBtn.classList.add("d-none")

    switch (container) {
        case "intro":
            introContainer.classList.remove("d-none")
            break;
        case "question":
            questionContainer.classList.remove("d-none")
            resetBtn.classList.remove("d-none")
            break;
        case "preference":
            preferenceContainer.classList.remove("d-none")
            resetBtn.classList.remove("d-none")
            break;
        case "result":
            resultContainer.classList.remove("d-none")
            resetBtn.classList.remove("d-none")
            break;
    }
}