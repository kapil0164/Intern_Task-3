// DOM element selectors
const setupBox = document.querySelector(".setup-box");
const quizBox = document.querySelector(".quiz-box");
const options = quizBox.querySelector(".options");
const nextBtn = quizBox.querySelector(".next-btn");
const progress = quizBox.querySelector(".progress");
const timeDisplay = quizBox.querySelector(".time");
const resultBox = document.querySelector(".result-box");
// Quiz state variables
const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let quizCategory = "programming";
let numberOfQuestions = 10;
let currentQuestion = null;
const questionsIndexHistory = [];
let correctAnswersCount = 0;
let disableSelection = false;
// Display the quiz result and hide the quiz container
const showQuizResult = () => {
  clearInterval(timer);
  document.querySelector(".quiz").classList.remove("active");
  document.querySelector(".result").classList.add("active");
  const resultText = `You answered <b>${correctAnswersCount}</b> out of <b>${numberOfQuestions}</b> questions correctly. Great effort!`;
  resultBox.querySelector(".score").innerHTML = resultText;
};
// Clear and reset the timer
const resetTimer = () => {
  clearInterval(timer);
  currentTime = QUIZ_TIME_LIMIT;
  timeDisplay.textContent = `${currentTime}s`;
};
// Initialize and start the timer for the current question
const startTimer = () => {
  timer = setInterval(() => {
    currentTime--;
    timeDisplay.textContent = `${currentTime}s`;
    if (currentTime <= 0) {
      clearInterval(timer);
      disableSelection = true;
      nextBtn.style.visibility = "visible";
      quizBox.querySelector(".timer").style.background = "#c31402";
      highlightCorrectAnswer();
      // Disable all answer options after one option is selected
      options.querySelectorAll(".option").forEach((opt) => (opt.style.pointerEvents = "none"));
    }
  }, 1000);
};
// Fetch a random question from based on the selected category
const getRandomQuestion = () => {
  const categoryQuestions = questions.find((cat) => cat.category.toLowerCase() === quizCategory.toLowerCase())?.questions || [];
  // Show the results if all questions have been used
  if (questionsIndexHistory.length >= Math.min(numberOfQuestions, categoryQuestions.length)) {
    return showQuizResult();
  }
  // Filter out already asked questions and choose a random one
  const availableQuestions = categoryQuestions.filter((_, index) => !questionsIndexHistory.includes(index));
  const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  questionsIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
  return randomQuestion;
};
// Highlight the correct answer option and add icon
const highlightCorrectAnswer = () => {
  const correctOption = options.querySelectorAll(".option")[currentQuestion.correctAnswer];
  correctOption.classList.add("correct");
  const iconHTML = `<span class="material-symbols-rounded"> check_circle </span>`;
  correctOption.insertAdjacentHTML("beforeend", iconHTML);
};

// Handle the user's answer selection
const handleAnswer = (option, answerIndex) => {
  if (disableSelection) return;
  clearInterval(timer);
  disableSelection = true;
  const isCorrect = currentQuestion.correctAnswer === answerIndex;
  option.classList.add(isCorrect ? "correct" : "incorrect");
  !isCorrect ? highlightCorrectAnswer() : correctAnswersCount++;
  // Insert icon based on correctness
  const iconHTML = `<span class="material-symbols-rounded"> ${isCorrect ? "check_circle" : "cancel"} </span>`;
  option.insertAdjacentHTML("beforeend", iconHTML);
  // Disable all answer options after one option is selected
  options.querySelectorAll(".option").forEach((opt) => (opt.style.pointerEvents = "none"));
  nextBtn.style.visibility = "visible";
};
// Render the current question and its options in the quiz
const renderQuestion = () => {
  currentQuestion = getRandomQuestion();
  if (!currentQuestion) return;
  disableSelection = false;
  resetTimer();
  startTimer();
  // Update the UI
  nextBtn.style.visibility = "hidden";
  quizBox.querySelector(".timer").style.background = "#32313C";
  quizBox.querySelector(".question").textContent = currentQuestion.question;
  progress.innerHTML = `<b>${questionsIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;
  options.innerHTML = "";
  // Create option <li> elements, append them, and add click event listeners
  currentQuestion.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("option");
    li.textContent = option;
    options.append(li);
    li.addEventListener("click", () => handleAnswer(li, index));
  });
};
// Start the quiz and render the random question
const startQuiz = () => {
  document.querySelector(".setup").classList.remove("active");
  document.querySelector(".quiz").classList.add("active");
  // Update the quiz category and number of questions
  quizCategory = setupBox.querySelector(".cat-btn.active").textContent;
  numberOfQuestions = parseInt(setupBox.querySelector(".num-btn.active").textContent);
  renderQuestion();
};
// Highlight the selected option on click - category or no. of question
setupBox.querySelectorAll(".cat-btn, .num-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.parentNode.querySelector(".active").classList.remove("active");
    btn.classList.add("active");
  });
});
// Reset the quiz and return to the configuration container
const resetQuiz = () => {
  resetTimer();
  correctAnswersCount = 0;
  questionsIndexHistory.length = 0;
  document.querySelector(".setup").classList.add("active");
  document.querySelector(".result").classList.remove("active");
};
// Event listeners
nextBtn.addEventListener("click", renderQuestion);
resultBox.querySelector(".restart-btn").addEventListener("click", resetQuiz);
setupBox.querySelector(".start-btn").addEventListener("click", startQuiz);