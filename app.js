let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset-btn");
let newGamebtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let botbtn = document.querySelector("#modee");

let turn = true;
let count = 0;
let bot = false;
let gameActive = true;

const winpatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

const resetgame = () => {
  turn = true;
  count = 0;
  gameActive = true;
  enableBoxes();
  msgContainer.classList.add("hide");
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (!gameActive || box.innerText !== "") return;

    box.innerText = turn ? "O" : "X";
    box.disabled = true;
    count++;

    let isWinner = CheckWinner();
    if (isWinner) {
      gameActive = false;
      return;
    }

    if (count === 9) {
      gameDraw();
      gameActive = false;
      return;
    }

    turn = !turn;

    if (bot && !turn && gameActive) {
      setTimeout(botmove, 400);
    }
  });
});

function botmove() {
  if (!gameActive) return;

  // get empty boxes
  let emptyBoxes = [];
  boxes.forEach((box, index) => {
    if (box.innerText === "") emptyBoxes.push(index);
  });

  if (emptyBoxes.length === 0) return;

  // simple AI: block or win if possible
  let moveMade = false;

  // try to win
  for (let pattern of winpatterns) {
    let [a, b, c] = pattern;
    let vals = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
    if (vals.filter(v => v === "X").length === 2 && vals.includes("")) {
      let index = pattern[vals.indexOf("")];
      makeBotMove(index);
      moveMade = true;
      break;
    }
  }

  // try to block
  if (!moveMade) {
    for (let pattern of winpatterns) {
      let [a, b, c] = pattern;
      let vals = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
      if (vals.filter(v => v === "O").length === 2 && vals.includes("")) {
        let index = pattern[vals.indexOf("")];
        makeBotMove(index);
        moveMade = true;
        break;
      }
    }
  }

  // else random
  if (!moveMade) {
    let randomIndex = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
    makeBotMove(randomIndex);
  }
}

function makeBotMove(index) {
  boxes[index].innerText = "X";
  boxes[index].disabled = true;
  count++;

  let isWinner = CheckWinner();
  if (isWinner) {
    gameActive = false;
    return;
  }

  if (count === 9 && !isWinner) {
    gameDraw();
    gameActive = false;
    return;
  }

  turn = true;
}

const gameDraw = () => {
  msg.innerText = "Game was a Draw! Try Again.";
  msgContainer.classList.remove("hide");
  disableBoxes();
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

const showWinner = (winner) => {
  msg.innerText = `Congratulations, Winner is ${winner}`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

const CheckWinner = () => {
  for (let pattern of winpatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val && pos1Val === pos2Val && pos2Val === pos3Val) {
      showWinner(pos1Val);
      return true;
    }
  }
  return false;
};

newGamebtn.addEventListener("click", resetgame);
resetbtn.addEventListener("click", resetgame);

botbtn.addEventListener("click", () => {
  bot = !bot;
  botbtn.innerText = bot ? "Mode: Player vs Bot 🤖" : "Mode: Player vs Player 👥";
  resetgame();
});
