var gameContainer = document.getElementById("game-container");
var allBlocksArray = [];

//Game Grid
gameGrid(30, 30);

function gameGrid(height, width) {
  console.log(gameContainer, document.getElementById("snake-content"));
  for (i = 0; i < height; i++) {
    var gameLine = document.createElement("div");
    gameContainer.append(gameLine);
    gameContainer.children[i].classList.add("block-line");
    gameContainer.children[i].setAttribute("id", "block-line-" + (i + 1));
    for (j = 0; j < width; j++) {
      var blockLine = document.getElementById("block-line-" + (i + 1));
      var gameBlock = document.createElement("div");
      blockLine.append(gameBlock);
      blockLine.children[j].classList.add("game-block");
      blockLine.children[j].setAttribute(
        "id",
        "block-number-" + ((i + 1) * 100 + (j + 1))
      );
      document.getElementById(
        "block-number-" + ((i + 1) * 100 + (j + 1))
      ).style.width = 1000 / width + "px";
      document.getElementById(
        "block-number-" + ((i + 1) * 100 + (j + 1))
      ).style.height = 1000 / height + "px";
      allBlocksArray.push((i + 1) * 100 + (j + 1));
    }
  }
}

//Snake & Apple Start Position and Render

function Snake(lengthArr, currentDirection, bufferedDirection, speedValue) {
  this.lengthArr = lengthArr;

  this.currentDirection = currentDirection;
  this.bufferedDirection = bufferedDirection;
  this.speed;
  this.speedValue = speedValue;

  this.shading = () => {
    for (i = 0; i < this.lengthArr.length; i++) {
      snakeSegment = document.getElementById(
        "block-number-" + this.lengthArr[i]
      );
    //   if (i = 1) {
        snakeSegment.classList.add("smiley");
    //     console.log("hi");
    //   }
      snakeSegment.classList.add("snake");
    }
  };

  this.updateSpeed = () => {
    this.speedValue -= 0.015 * this.speedValue;
    clearInterval(this.speed);
    this.speed = setInterval(this.motion, this.speedValue);
  };

  this.motion = () => {
    this.directionChange();
    if (this.currentDirection == "right") {
      this.lengthArr.push(this.lengthArr[this.lengthArr.length - 1] + 1);
      this.checkAndUpdate();
    }
    if (this.currentDirection == "down") {
      this.lengthArr.push(this.lengthArr[this.lengthArr.length - 1] + 100);
      this.checkAndUpdate();
    }
    if (this.currentDirection == "up") {
      this.lengthArr.push(this.lengthArr[this.lengthArr.length - 1] - 100);
      this.checkAndUpdate();
    }
    if (this.currentDirection == "left") {
      this.lengthArr.push(this.lengthArr[this.lengthArr.length - 1] - 1);
      this.checkAndUpdate();
    }
    this.shading();
  };

  this.directionChange = () => {
    switch (this.currentDirection) {
      case "left":
      case "right":
        if (
          this.bufferedDirection === "up" ||
          this.bufferedDirection === "down"
        ) {
          this.currentDirection = this.bufferedDirection;
        }
        break;
      case "up":
      case "down":
        if (
          this.bufferedDirection === "left" ||
          this.bufferedDirection === "right"
        ) {
          this.currentDirection = this.bufferedDirection;
        }
        break;
    }
  };

  this.checkAndUpdate = () => {
    var testValid = document.getElementById(
      "block-number-" + this.lengthArr[this.lengthArr.length - 1]
    );
    if (testValid == null || testValid.classList.contains("snake")) {
      gameOver.call(this);
    } else if (testValid.classList.contains("apple")) {
      gameApple.location.classList.remove("apple");
      gameApple.location.classList.add("snake");
      gameApple.reassign();
      soundGrabApple.play();
      soundBackgoundMusic.sound.playbackRate = (
        soundBackgoundMusic.sound.playbackRate + 0.005
      ).toFixed(4);
      this.updateSpeed();
      scoreUpdate.call(this);
    } else {
      var snakeSegment = document.getElementById(
        "block-number-" + this.lengthArr[0]
      );
      snakeSegment.classList.remove("snake");
      snakeSegment.classList.remove("smiley");

      this.lengthArr.shift();
    }
  };
}

function Apple(location) {
  this.location = document.getElementById("block-number-" + location);

  this.shade = () => {
    this.location.classList.add("apple");
  };

  this.reassign = () => {
    scramble();
    for (i = 0; i < allBlocksArray.length; i++) {
      var potentialNewApplePosition = document.getElementById(
        "block-number-" + allBlocksArray[i]
      );
      if (potentialNewApplePosition.classList.contains("snake")) {
        continue;
      } else {
        this.location = document.getElementById(
          "block-number-" + allBlocksArray[i]
        );
        this.location.classList.add("apple");
        break;
      }
    }
    function scramble() {
      allBlocksArray.sort(function(a, b) {
        return 0.5 - Math.random();
      });
    }
  };
}

var gameSnake = new Snake(
  [2210, 2211, 2212, 2213, 2214, 2215, 2216, 2217],
  "right",
  "right",
  speedScreenSize()
);
var gameApple = new Apple(2020);

function speedScreenSize() {
  if (window.innerWidth < 1000) {
    return 250;
  } else {
    return 120;
  }
}

gameSnake.shading();

gameApple.shade();

//Key Input and Direction Change
window.addEventListener("keydown", function(e) {
  key = e.which;
  switch (key) {
    case 37:
      e.preventDefault();
      gameSnake.bufferedDirection = "left";
      break;
    case 38:
      e.preventDefault();
      gameSnake.bufferedDirection = "up";
      break;
    case 39:
      e.preventDefault();
      gameSnake.bufferedDirection = "right";
      break;
    case 40:
      e.preventDefault();
      gameSnake.bufferedDirection = "down";
      break;
  }
});

//Game Over
function gameOver() {
  clearInterval(this.speed);

  var finalScore;
  //   fetch(
  //     "https://us-central1-snake-game-1bf7b.cloudfunctions.net/gameOver?userID=" +
  //       gameSessionID
  //   )
  //     .then(res => {
  //       return res.json();
  //     })
  //     .then(data => {
  console.log("Final Score: ", data.score);
  finalScore = data.score;
  alert("Your Score was: " + finalScore + "\n press 'OK' to restart");
  setTimeout(function() {
    location.reload();
  }, 1000);
  //   return;
  // });
}

//Points
var points = document.getElementById("points");
var lastTime = timeStamp();

function scoreUpdate() {
  //   fetch(
  //     "https://us-central1-snake-game-1bf7b.cloudfunctions.net/scoreUpdate?userID=" +
  //       gameSessionID
  //   )
  //     .then(res => {
  //       return res.json();
  //     })
  //     .then(data => {
  //       console.log(data);
  points.innerHTML = data.newScore;
  // });
}

function timeStamp() {
  var d = new Date();
  var n = d.getTime();
  return n;
}

var inpInt = document.getElementById("inpInt");
var btnSave = document.getElementById("btnSave");
var userInitials;

window.onload = function() {
  inpInt.focus();
};

//Dialog Box Functions
function viewNoStart() {
  document.querySelector("#pop-up-bg").style.display = "none";
  document.querySelector("#pop-up").style.display = "none";
}

var gameSessionID;
var init = document.querySelector("#inpInt");
init.addEventListener("keyup", function(e) {
  if (e.keyCode === 13) {
    startGame();
  }
});

function startGame() {
  // document.querySelector("#pop-up-bg").style.animation =
  //   "fadeOut 3s ease forwards";
  // document.querySelector("#pop-up").style.display = "none";
  userInitials = "COW"; //inpInt.value.toUpperCase();
  setTimeout(function() {
    gameSnake.speed = setInterval(gameSnake.motion, gameSnake.speedValue);
  }, 5000);
  countdown();
  // fetch(
  //   "https://us-central1-snake-game-1bf7b.cloudfunctions.net/newGameSession?init=" +
  //     userInitials
  // )
  //   .then(res => {
  //     return res.json();
  //   })
  //   .then(data => {
  //     console.log(data);
  //     points.innerHTML = data.score;
  //     gameSessionID = data.userID;
  //   });
  //   }
}

function countdown() {
  var countdownTimer = document.querySelector("#countdown");
  countdownTimer.style.display = "block";
  var count = 3;
  var counter = setInterval(function() {
    if (countdownTimer.innerHTML === "Begin!") {
      countdownTimer.style.display = "none";
      clearInterval(counter);
    } else if (countdownTimer.innerHTML === "1") {
      countdownTimer.style.fontSize = "150px";
      countdownTimer.innerHTML = "Begin!";
    } else {
      countdownTimer.innerHTML = count;
      count--;
    }
  }, 1000);
}

//MobileControls - this feature doesn't work!!!!
var swipeZone = document;
swipedetect(swipeZone, function(swipedir) {
  if (swipedir !== "none") {
    gameSnake.bufferedDirection = swipedir;
  }
});
