// Game object definitions
var GameObjects = function(x, y, imageInfo){
  this.x = x;
  this.y = y;
  this.imageInfo = imageInfo;
}

var badGuys = {
  imageInfo: 'images/enemy-bug.png',
  width: 101,
  height: 171
};

var goodGuy = {
  imageInfo: 'images/char-boy.png',
  width: 101,
  height: 171,
  bound: {
    left: 0,
    right: 600,
    bottom: 405
  },
  move: {
    vert: 83,
    horiz: 101
  }
};
// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    var maxSpeed = 300;
    var minSpeed = 150;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = Math.floor(Math.random() * maxSpeed + minSpeed);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if(this.x > 707) {
      this.reset();
    }
    this.checkCollision();
};
// Draw the Enemies
Enemy.prototype.render = function(x, y, imageInfo) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Collision Detection
Enemy.prototype.checkCollision = function() {
    if (player.x < this.x + (badGuys.width / 2) &&
        player.x + (goodGuy.width / 2) > this.x &&
        player.y < this.y + (badGuys.height / 3) &&
        (goodGuy.height / 4) + player.y > this.y) {
        player.collision = true;
    }
};
// Set Enemies to starting positions and randomize their speeds again
Enemy.prototype.reset = function() {
    this.x = -this.x;
    this.speed = Math.floor(Math.random() * (300) + 150);
};
// Draw the objects on the screen, required method for game
GameObjects.prototype.render = function() {
    ctx.drawImage(Resources.get(this.imageInfo.imageInfo), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, imageInfo){
    GameObjects.call(this, x, y, imageInfo);
}
Player.prototype = Object.create(GameObjects.prototype);
Player.prototype.constructor = Player;

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
Player.prototype.lives = 3;
Player.prototype.points = 0;
Player.prototype.level = 0;
Player.prototype.update = function(dt){
    // Displays Player Score and Lives above the board
    // Uses jQuery to act on the html
    var points = 'SCORE: %data%';
    var lives = 'LIVES: %data%';
    var highScore = 'HIGHSCORE: %data%';
    var updatedScore = points.replace("%data%", player.points);
    var updatedLives = lives.replace("%data%", player.lives);
    if (player.points > player.highScore){
      player.highScore = player.points;
    }
    var updatedHS = highScore.replace("%data%", player.highScore);
    $("#score").html("");
    $("#score").html(updatedScore + ' ' + updatedLives + ' ' + updatedHS);
    // Checks player state dead/points
    // Asks player if they want to keep playing
    // Update Lives
    if (player.collision == true) {
        player.lives -= 1;
        player.collision = false;
        //alert("You got Bugged!");
        // Play again? Thanks player for playing, Resets player if they have more Lives
        if (player.lives < 0) {
            /*var restart = confirm("You got " + player.points + " points. Try again?");
            if (restart == true) {

            } else {
                alert("Thank you for playing Bugged.");
            }*/
            player.lives = 3;
            player.points = 0;
            player.level = 0;
            allEnemies = [
              new Enemy(-100, 65),
              new Enemy(-300, 225),
              new Enemy(-50, 310),
              new Enemy(-25, 140)
            ];
            setTimeout(player.reset(), 3000 * dt);
        } else {
            setTimeout(player.reset(), 3000 * dt);
        }
    }
    // Updates Level
    if (player.y == -10 && player.x == 303) {
        player.level += 1;
        player.points += 50;
        setTimeout(player.reset(), 3000 * dt);
        var bug = new Enemy(-100, Math.floor(Math.random() * 264));
        allEnemies.push(bug);
    }
};
Player.prototype.collision = false;
Player.prototype.highScore = 0;
Player.prototype.handleInput = function(keyPress){
    switch(keyPress) {
      case 'left' : {
        if(this.x > goodGuy.bound.left) this.x -= goodGuy.move.horiz;
        console.log("Left");
        console.log(this.x);
        console.log(this.y);
        break;
      }
      case 'up' : {
        if(this.y > goodGuy.bound.left) this.y -= goodGuy.move.vert;
        console.log("Up");
        console.log(this.x);
        console.log(this.y);
        break;
      }
      case 'right' : {
        if(this.x < goodGuy.bound.right) this.x += goodGuy.move.horiz;
        console.log("Right");
        console.log(this.x);
        console.log(this.y);
        break;
      }
      case 'down' : {
        if(this.y < goodGuy.bound.bottom) this.y += goodGuy.move.vert;
        console.log("Down");
        console.log(this.x);
        console.log(this.y);
        break;
      }
    }

};
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.imageInfo.imageInfo), this.x, this.y);
};
Player.prototype.reset = function(){
    this.x = 303;
    this.y = 405;
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Enemies
var allEnemies = [
  new Enemy(-100, 65),
  new Enemy(-300, 225),
  new Enemy(-50, 310),
  new Enemy(-25, 140)
];
// Player
var player = new Player(303, 405, goodGuy);
// Instrucitons
var instr = 'Use the arrow keys to move, Up, Down, Left & Right. Avoid the Bugs and reach the star to earn points.';
$("#instructions").append(instr);
