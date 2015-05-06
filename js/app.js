// Enemies our player must avoid
var Enemy = function(Enemies) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.name = Enemies;
    // Start them off of the screen so that they
    // arrive smoothly.
    // Put them further off of the screen
    // To randomize their entry time.
    this.x = -10 - randomInterval(0, 250);
    this.y = 60 + (85 * randomInterval(0, 2));
    this.bottomSpeed = 400;
    this.topSpeed = 500;
    this.speed = randomInterval(this.topSpeed, this.bottomSpeed);
    this.hitPlayerRecently = false;
    this.hitTimeout = 0;
};
function randomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    // Let them go off of the screen before,
    // moving them back so that they travel off
    // smoothly.
    if (this.x > 510) {
        // Put them further off of the screen
        // To randomize their entry time.
        this.x = -10 - randomInterval(0, 250);
        this.y = 60 + (85 * randomInterval(0, 2));
        // Reset their speed to enhance game variability
        this.speed = randomInterval(this.topSpeed, this.bottomSpeed);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // Add some fun text to any enemy who recently hit the player
    if (this.hitPlayerRecently) {
        if (this.hitTimeout < 30) {
            ctx.font = '36pt impact';
            ctx.fillStyle = 'Yellow';
            ctx.strokeStyle = 'black';
            ctx.fillText('BAM-BAM!', this.x - 55, this.y + 70);
            ctx.strokeText('BAM-BAM!', this.x - 55, this.y + 70);
            this.hitTimeout += 1;
        } else {
            this.hitPlayerRecently = false;
            this.hitTimeout = 0;
        }
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-princess-girl.png';
    this.col = 0;
    this.row = 5;
    this.crossings = 0;
};
Player.prototype.x = function() {
    return this.col * 101;
};
Player.prototype.y = function() {
    return (this.row * 84) - 23;
};
Player.prototype.update = function() {
    allEnemies.forEach(this.checkForCollision, this);
};
Player.prototype.checkForCollision = function(element, index, array) {
    var playerX = this.x();
    var playerY = this.y();
    if (element.x >= playerX - 10 && element.x <= playerX + 10) {
        if (element.y >= playerY - 10 && element.y <= playerY + 10) {
            // Put player back on the bottom row when he is hit.
            this.row = 5;
            // Set a temporary 'hit' variable to use in the enemy function.
            element.hitPlayerRecently = true;
            element.hitTimeout = 0;
            // Increase this enemy's speed after hitting the player.
            element.topSpeed += 15;
            element.bottomSpeed += 15;

        }
    }
};
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x(), this.y());
    ctx.font = '24pt impact';
    ctx.fillStyle = 'Red';
    ctx.fillText('Score: ' + this.crossings, 100, 576);
};
Player.prototype.handleInput = function(keycode) {
    //console.log(keycode);
    if (keycode === 'right') {
        this.col += 1;
    }
    if (keycode === 'left') {
        this.col -= 1;
    }
    // Do not allow player to go off of screen.
    if (this.col > 4) {
        this.col = 4;
    }
    if (this.col < 0) {
        this.col = 0;
    }
    if (keycode === 'down') {
        this.row += 1;
    }
    if (keycode === 'up') {
        this.row -= 1;
    }
    // Do not allow player to go off of screen.
    if (this.row > 5) {
        this.row = 5;
    }
    // Player has won!
    if (this.row < 1) {
        // Upadate the 'score'
        this.crossings += 1;
        // Send player back to start.
        this.row = 5;
    }
};


// Now instantiate your objects.// create an array of 5 enemies
// create an array of 5 enemies
var Lady = new Enemy('Lady');
var Bunny = new Enemy('Bunny');
var Red = new Enemy('Red');
var Crazy = new Enemy('Crazy');
var Bill = new Enemy('Bill');
// Place all enemy objects in an array called allEnemies
var allEnemies = [Lady,Bunny,Red,Crazy,Bill];
var player = new Player();


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
