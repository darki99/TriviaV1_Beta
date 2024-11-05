const startButton = document.getElementById('start-btn');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const progressText = document.getElementById('progress'); // Elemento de progreso
const welcomeScreen = document.getElementById('welcome-screen');
const scoreElement = document.getElementById('score').querySelector('span'); // Elemento del puntaje

let questions = [];
let currentQuestionIndex = 0;
let score = 0; // Variable para puntaje

startButton.addEventListener('click', startGame);
const restartButton = document.getElementById('restart-btn');
restartButton.addEventListener('click', restartGame); // Añadir evento al botón de reinicio

async function startGame() {
    // Oculta la pantalla de bienvenida
    welcomeScreen.classList.add('hide');

    // Muestra la pantalla de preguntas y resetea variables
    questionContainer.classList.remove('hide');
    currentQuestionIndex = 0;
    score = 0; // Reinicia el puntaje
    scoreElement.innerText = score; // Muestra puntaje inicial
    questions = await fetchQuestions(); // Asegúrate de que esta línea esté después de la definición de fetchQuestions
    
    // Comienza con la primera pregunta
    setNextQuestion();
}

async function fetchQuestions() {
    try {
        const response = await fetch('https://the-trivia-api.com/api/questions?limit=10');
        if (!response.ok) throw new Error('Error en la solicitud');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Hubo un problema con la solicitud fetch:', error);
        return [];
    }
}

function setNextQuestion() {
    // Actualiza el progreso de la pregunta
    progressText.innerText = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`;
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    const answers = [question.correctAnswer, ...question.incorrectAnswers];
    const shuffledAnswers = answers.sort(() => Math.random() - 0.5);

    // Borra respuestas previas
    answersElement.innerHTML = '';
    shuffledAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.classList.add('btn');
        button.addEventListener('click', selectAnswer);
        answersElement.appendChild(button);
    });
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.innerText === questions[currentQuestionIndex].correctAnswer;
    
    // Limpiar mensajes previos
    document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('correct', 'incorrect'));
    
    // Mostrar correcto o incorrecto
    if (correct) {
        selectedButton.classList.add('correct');
        score++; // Incrementa el puntaje si la respuesta es correcta
        scoreElement.innerText = score; // Actualiza el puntaje mostrado
    } else {
        selectedButton.classList.add('incorrect');
        const correctButton = Array.from(answersElement.children).find(button => button.innerText === questions[currentQuestionIndex].correctAnswer);
        if (correctButton) correctButton.classList.add('correct');
    }
    
    // Esperar 1 segundo antes de pasar a la siguiente pregunta
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            setNextQuestion();
        } else {
            endGame();
        }
    }, 1000);
}

function endGame() {
    // Actualiza el texto del puntaje final
    const finalScoreElement = document.getElementById('score').querySelector('span');
    finalScoreElement.innerText = score; // Muestra el puntaje final
    
    // Muestra la pantalla de resultados y oculta la de preguntas
    questionContainer.classList.add('hide');
    document.getElementById('result-screen').classList.remove('hide'); // Muestra la pantalla de resultados
}

function restartGame() {
    // Oculta la pantalla de resultados
    document.getElementById('result-screen').classList.add('hide');

    // Muestra la pantalla de bienvenida
    welcomeScreen.classList.remove('hide');

    // Reinicia la lógica del juego si es necesario
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.innerText = score; // Resetea el puntaje mostrado
}
