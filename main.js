let count = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let spans = document.querySelector(".spans");
let quizArea = document.querySelector(".quiz-area");
let submite = document.querySelector(".submite");
let answerArea = document.querySelector(".answer-area");
let results = document.querySelector(".results");
let countDowenEle = document.querySelector(".count-dowen");

let currentIndex = 0;
let rightAnswers = 0;
let countDowenInterval;

async function getData() {
  const response = await fetch("quiz.json");
  let myReqObject = await response.json();

  let qCount = myReqObject.length;
  getBulletNumber(qCount);
  getQuestion(myReqObject[currentIndex], qCount);

  countDowen(10, qCount);
  submite.onclick = function () {
    checkAnswer(myReqObject[currentIndex].right_answer, qCount);
    currentIndex++;
    quizArea.innerHTML = "";
    answerArea.innerHTML = "";
    getQuestion(myReqObject[currentIndex], qCount);
    handleBullets();
    showResult(qCount);
    clearInterval(countDowenInterval);
    countDowen(10, qCount);
  };
}

function getBulletNumber(num) {
  count.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");
    spans.appendChild(span);
    if (i == 0) {
      span.className = "up";
    }
  }
}

function getQuestion(obj, num) {
  if (currentIndex < num) {
    let title = document.createElement("h2");
    titleText = document.createTextNode(obj.title);
    title.appendChild(titleText);
    quizArea.appendChild(title);

    for (let i = 1; i <= 3; i++) {
      let answer = document.createElement("div");
      answer.className = `answer`;
      let input = document.createElement("input");
      input.name = "question";
      input.type = "radio";
      input.dataset.answer = obj[`answer_${i}`];
      input.id = `answer_${i}`;

      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      labeltxt = document.createTextNode(obj[`answer_${i}`]);

      label.appendChild(labeltxt);
      answer.appendChild(input);
      answer.appendChild(label);
      answerArea.appendChild(answer);
      if (i == 1) {
        input.checked = true;
      }
    }
  }
}

function checkAnswer(rAnswer, num) {
  let choosen;
  let answers = document.getElementsByName("question");

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosen = answers[i].dataset.answer;
    }
  }

  if (choosen === rAnswer) {
    rightAnswers++;
    console.log("you are right");
  }
}

function handleBullets() {
  let spans = document.querySelectorAll(".spans span");
  let arrbullets = Array.from(spans);
  arrbullets.forEach((span, index) => {
    if (index == currentIndex) {
      span.className = "up";
    }
  });
}

function showResult(num) {
  if (num === currentIndex) {
    let res;

    quizArea.remove();
    answerArea.remove();
    submite.remove();
    bullets.remove();

    if (rightAnswers > num / 2 && rightAnswers < num) {
      res = `<span class="good">good you answer ${rightAnswers} from ${num}</span>`;
    } else if (rightAnswers === num) {
      res = `<span class="perfect">perfect you answer ${rightAnswers} from ${num}</span>`;
    } else {
      res = `<span class="bad">bad you answer ${rightAnswers} from ${num}</span>`;
    }

    results.innerHTML = res;
  }
}

function countDowen(duration, num) {
  if (currentIndex < num) {
    countDowenInterval = setInterval(() => {
      let minutes = parseInt(duration / 60);
      let seconds = parseInt(duration % 60);

      minutes < 10 ? (minutes = `0${minutes}`) : (minutes = minutes);
      seconds < 10 ? (seconds = `0${seconds}`) : (seconds = seconds);

      countDowenEle.innerHTML = `${minutes} : ${seconds}`;

      if (--duration < 0) {
        clearInterval(countDowenInterval);
        submite.click();
      }
    }, 1000);
  }
}

getData();
