var gameContainer = document.getElementById("game-container");
var allBlocksArray = [];
var score = 0;
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

//Worm & Apple Start Position and Render

function Worm(lengthArr, currentDirection, bufferedDirection, speedValue) {
  this.lengthArr = lengthArr;

  this.currentDirection = currentDirection;
  this.bufferedDirection = bufferedDirection;
  this.speed;
  this.speedValue = speedValue;

  this.shading = () => {
    for (i = 0; i < this.lengthArr.length; i++) {
      wormSegment = document.getElementById(
        "block-number-" + this.lengthArr[i]
      );
      wormSegment.classList.remove("smiley");

      wormSegment1 = document.getElementById(
        "block-number-" + this.lengthArr[this.lengthArr.length - 1]
      );
      wormSegment1.classList.add("smiley");
      wormSegment.classList.add("snake");
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
      testValid.classList.remove("smiley");

      gameApple.location.classList.remove("apple");
      testValid.classList.remove("smiley");

      gameApple.location.classList.add("smiley");
      gameApple.location.classList.add("snake");

      gameApple.reassign();
      this.updateSpeed();
      scoreUpdate.call(this);
    } else {
      var wormSegment = document.getElementById(
        "block-number-" + this.lengthArr[0]
      );
      wormSegment.classList.remove("snake");
      wormSegment.classList.remove("smiley");

      this.lengthArr.shift();
    }
    score = lengthArr - 8;
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

var gameWorm = new Worm(
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

gameWorm.shading();

gameApple.shade();

//Key Input and Direction Change
window.addEventListener("keydown", function(e) {
  key = e.which;
  switch (key) {
    case 37:
      e.preventDefault();
      gameWorm.bufferedDirection = "left";
      break;
    case 38:
      e.preventDefault();
      gameWorm.bufferedDirection = "up";
      break;
    case 39:
      e.preventDefault();
      gameWorm.bufferedDirection = "right";
      break;
    case 40:
      e.preventDefault();
      gameWorm.bufferedDirection = "down";
      break;
  }
});

//Game Over
function gameOver() {
  clearInterval(this.speed);

  var finalScore;
//   gameOverText();

  //   console.log("Final Score: ", data.score);
  finalScore = score;
    alert("Your Score was: " + score);
  setTimeout(function() {
    location.reload();
  }, 1000);

}

//Points
var points = document.getElementById("points");
var lastTime = timeStamp();

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

  userInitials = "COW"; 
  setTimeout(function() {
    gameWorm.speed = setInterval(gameWorm.motion, gameWorm.speedValue);
  }, 5000);
  countdown();
}

function gameOverText() {
  var endGame = document.querySelector("#countdown");
  endGame.style.display = "block";
  var count = 0;
  var done = setInterval(function() {
    if (endGame.innerHTML === "OUCH!") {
      endGame.innerHTML = "OUCH!";
    } else if(count >5) {
        endGame.style.display = "none";
      clearInterval(done);
    }
    count = count +1;
  }, 1000);
  endGame.style.display = "none";
}

function countdown() {
  var starterClock = document.querySelector("#countdown");
  starterClock.style.display = "block";
  var count = 3;
  var counter = setInterval(function() {
    if (starterClock.innerHTML === "Go!") {
      starterClock.style.display = "none";
      clearInterval(counter);
    } else if (starterClock.innerHTML === "1") {
      //   starterClock.style.fontSize = "150px";
      starterClock.innerHTML = "Go!";
    } else {
      starterClock.innerHTML = count;
      count--;
    }
  }, 1000);
}

//MobileControls - this feature doesn't work!!!!
var swipeZone = document;
swipedetect(swipeZone, function(swipedir) {
  if (swipedir !== "none") {
    gameWorm.bufferedDirection = swipedir;
  }
});
