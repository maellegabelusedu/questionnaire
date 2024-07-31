// script.js
const questionsWithOptions = {
    "Quelle est votre genre ?": ["Homme", "Femme", "Non genre", "Autre"],
    "A quelle tranche d'âge faites-vous partie ?": ["18-25 ans", "26-35 ans", "36-45 ans", "46-55 ans", "56-65 ans", "66 ans et plus"],
    "Quelle est votre estime de vous-même ?": ["Haute", "Basse", "Moyenne"],
    "Le temps passé avec vos amis est-il primordial pour vous ?": ["Oui", "Non", "Je ne sais pas"],
    "Êtes-vous solitaire ?": ["Oui", "Non", "Je ne sais pas"],
    "Faites-vous attention à vos mots lorsque vous discutez avec quelqu'un ?": ["Oui", "Non", "Je ne sais pas"],
    "La vie des personnes que vous ne connaissez pas vous importe-t-elle ?": ["Oui", "Non", "Je ne sais pas"],
    "Quelle importance accordez-vous lorsque vous voyez quelqu'un d'autre heureux ?": ["Très haute", "Haute", "Moyenne", "Basse", "Très basse"],
    "Lorsque vous êtes stressé(e), préférez-vous le gérer seul(e) ou avec quelqu'un ?": ["Seul(e)", "Avec quelqu'un", "Je ne sais pas"],
    "Exprimez-vous votre tristesse lorsque vous vous sentez abattu(e) ?": ["Oui", "Non", "Je ne sais pas"],
    "Préférez-vous être seul(e) lorsque vous êtes triste ?": ["Oui", "Non", "Je ne sais pas"],
    "Partagez-vous facilement la joie avec les autres ?": ["Oui", "Non", "Je ne sais pas"],
    "Pensez-vous que le bonheur s'apprend ?": ["Oui", "Non", "Je ne sais pas"]
};

const additionalQuestions = [
    "Après une journée difficile, comment vous détendez-vous ?",
    "Comment réagissez-vous face à une situation de stress imprévue ?",
    "Quelle est la première chose que vous faites lorsque vous vous sentez submergé(e) par le stress ?",
    "Quels sont les déclencheurs de votre anxiété ?",
    "Avez-vous des techniques spécifiques pour calmer votre anxiété ?",
    "Quelles activités vous aident à surmonter la tristesse ?",
    "Comment cultivez-vous le bonheur ?"
];

let currentQuestionIndex = 0;
let responses = {};

const questionnaireDiv = document.getElementById('questionnaire');
const questionDiv = document.getElementById('question');
const optionsDiv = document.getElementById('options');
const responseInput = document.getElementById('response');
const remainingCharsDiv = document.getElementById('remaining-chars');
const nextButton = document.getElementById('next-button');
const stopButton = document.getElementById('stop-button');
const summaryDiv = document.getElementById('summary');
const responsesDiv = document.getElementById('responses');
const saveButton = document.getElementById('save-button');

function displayQuestion() {
    if (currentQuestionIndex < Object.keys(questionsWithOptions).length) {
        const question = Object.keys(questionsWithOptions)[currentQuestionIndex];
        const options = questionsWithOptions[question];
        questionDiv.innerText = question;
        optionsDiv.innerHTML = '';
        responseInput.style.display = 'none';
        remainingCharsDiv.innerText = '';
        options.forEach((option, idx) => {
            const optionButton = document.createElement('button');
            optionButton.innerText = option;
            optionButton.onclick = () => saveResponse(question, option);
            optionsDiv.appendChild(optionButton);
        });
    } else if (currentQuestionIndex < Object.keys(questionsWithOptions).length + additionalQuestions.length) {
        const question = additionalQuestions[currentQuestionIndex - Object.keys(questionsWithOptions).length];
        questionDiv.innerText = question;
        optionsDiv.innerHTML = '';
        responseInput.style.display = 'block';
        remainingCharsDiv.innerText = 'Caractères restants : 200';
        responseInput.value = '';
        responseInput.oninput = () => {
            const remainingChars = 200 - responseInput.value.length;
            remainingCharsDiv.innerText = `Caractères restants : ${remainingChars}`;
        };
    } else {
        displaySummary();
    }
}

function saveResponse(question, response) {
    responses[question] = response;
    currentQuestionIndex++;
    displayQuestion();
}

function displaySummary() {
    questionnaireDiv.style.display = 'none';
    summaryDiv.style.display = 'block';
    responsesDiv.innerHTML = '';
    for (const question in responses) {
        const response = responses[question];
        const responseDiv = document.createElement('div');
        responseDiv.innerText = `${question} : ${response}`;
        responsesDiv.appendChild(responseDiv);
    }
}

nextButton.onclick = () => {
    if (currentQuestionIndex < Object.keys(questionsWithOptions).length + additionalQuestions.length) {
        if (currentQuestionIndex >= Object.keys(questionsWithOptions).length) {
            const question = additionalQuestions[currentQuestionIndex - Object.keys(questionsWithOptions).length];
            saveResponse(question, responseInput.value);
        }
    }
};

stopButton.onclick = () => {
    displaySummary();
};

saveButton.onclick = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
        + "Question,Réponse\n"
        + Object.entries(responses).map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "responses.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
};

// Initial call to display the first question
displayQuestion();
