// Each time this function is called a GameObject
// is create based on the arguments
// In JavaScript you can consider everything an Object
// including functions

//	W,A,S,D to move, E to hit enemy

//function for selecting different wepaons

//background image and source
var bg = new Image();
var bgSRC = "./Img/GrassTexture.jpg";
bg.src = bgSRC;
var DeathBGSRC = "./Img/WinScreen.png";
var WinBGSRC = "./Img/DeathScreen.png";

function CoinGameObj(x,y,PickedUp)
{
    this.x = x;
    this.y = y;
	this.PickedUp = PickedUp;
}

var coins = [new CoinGameObj(0,0,false),new CoinGameObj(0,0,false)];
//var coins = [new CoinGameObj(600,100,false),new CoinGameObj(350,300,false)];

function onPageLoad() 
{
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() { 
		if(this.readyState == 4 && this.status == 200) {
			var data = JSON.parse(this.responseText);
			coins[0].x = data.CoinOne;
			coins[0].y = data.CoinOne;
			coins[1].x = data.CoinTwo;
			coins[1].y = data.CoinTwo;
		}
	};
	
	xmlhttp.open("GET", "./data/level.json", true);
	xmlhttp.send();
	
}

var queryString = window.location.search;
var params = new URLSearchParams(queryString);
var FirstName = params.get("fname");
var SecondName = params.get("lname");
var weaponOfChoice = params.get("Weapon");

function weaponSelection() 
{
	document.getElementById("WelcomeName").innerHTML = "Welcome : " + FirstName + " " + SecondName;
	document.getElementById("HUD").innerHTML = "Weapon Of Choice : " + weaponOfChoice;

	console.log(weaponOfChoice);
	if(weaponOfChoice === "Stick")
	{
		images[1].src = "./Img/SpriteSheetStick.png";
	}
	else if (weaponOfChoice === "Sword")
	{
		images[1].src = "./Img/SpriteSheetSword.png";
	}
	else if(weaponOfChoice === "Fists")
	{
		images[1].src = "./Img/SpriteSheetNone.png";
	}
}

// Draw a HealthBar on Canvas, can be used to indicate players health
function drawPlayerHealthbar() {
  var width = 150;
  var height = 20;
  var max = 100;
  var val = gameobjects[0].health;

  // Draw the fill
  context.fillStyle = "#00FF00";
  var fillVal = Math.min(Math.max(val / max, 0), 1);
  context.fillRect(gameobjects[0].x, gameobjects[0].y - 50, fillVal * width, height);
}

// Draw a HealthBar on Canvas, can be used to indicate Enemys health
function drawEnemyHealthbar() {
  var width = 150;
  var height = 20;
  var max = 100;
  var val = gameobjects[2].health;

  // Draw the fill
  context.fillStyle = "#FF0000";
  var fillVal = Math.min(Math.max(val / max, 0), 1);
  context.fillRect(gameobjects[2].x, gameobjects[2].y + 170, fillVal * width, height);
}

function GameObject(name, img, health,x,y)
{
    this.name = name;
    this.img = img;
    this.health = health;
    this.x = x;
    this.y = y;
}



// The GamerInput is an Object that holds the Current
// GamerInput (Left, Right, Up, Down)
function GamerInput(input) {
    this.action = input;
}

// Default GamerInput is set to None
var gamerInput = new GamerInput("None"); //No Input
// Default Player
var player = new GameObject("Player", "./Img/SpriteSheet.png", 100, 600, 600);
//Player Weapon
var StickObject = new GameObject("Stick", "./Img/SpriteSheetStick.png", 0, -25, -25);
// Gameobjects is a collection of the Actors within the game
var gameobjects = [player, StickObject, new GameObject("NPC", "./Img/1to6.png", 100, 0, 0)];

// get a handle to the canvas context
var canvas = document.getElementById("game");
// get 2D context for this canvas
var context = canvas.getContext("2d");

//coin objects

var coinImages = new Array(); 
for (i = 0; i < coins.length; i++)
{
	coinImages.push(new Image());
	coinImages[i].src = "./Img/Coin.png";
}

//images array
var images = new Array(); 
for (i = 0; i < gameobjects.length; i++)
{
	images.push(new Image());
	images[i].src = gameobjects[i].img;
}

// Initial time set
var initial = new Date().getTime();
var initialStickTime = new Date().getTime();
var current; // current time
var currentStickTime; // current time

// bool for animating stick object
var isEPressed = false;
// Current Frame
var currentFrame = 0;
// Current Frame
var currentStickFrame = 0;
// Total Frames
var frames = 6;

//range for enemy to follow player
var DetectRange = 250;
//range for enemy to Hit player
var NPCHitRange = 150;
//range for player to Hit enemy
var PlayerHitRange = 350;

//diffrent button on mouse up event listiners
document.getElementById("buttonUp").onmouseup = function() {ButtonUp()};
document.getElementById("buttonDown").onmouseup = function() {ButtonUp()};
document.getElementById("buttonLeft").onmouseup = function() {ButtonUp()};
document.getElementById("buttonRight").onmouseup = function() {ButtonUp()};
document.getElementById("MeleeButton").onmouseup = function() {MeleeButtonUp()};

var mySound = document.getElementById("sound");   

//function for Left Input
function LeftbuttonOnClick(){
	gamerInput = new GamerInput("Left");
}

//function for right Input
function RightbuttonOnClick(){
	gamerInput = new GamerInput("Right");
}

//function for up Input
function UpbuttonOnClick()
{
   gamerInput = new GamerInput("Up");
}

//function for down Input
function DownbuttonOnClick(){
	gamerInput = new GamerInput("Down");
}

//function for when movment buttons goes up
function ButtonUp(){
	gamerInput = new GamerInput("None");
}

//function for Melee Input when button goes Down
function MeleeButtonDown(){
	isEPressed = true;
}

//function for Melee Input when button goes up
function MeleeButtonUp(){
	isEPressed = false;
}

//npc mvoment code, for making npc follow player
function NPCMovement()
{
	
	// Player x co-ord follow player code
	if(gameobjects[2].x < gameobjects[0].x)
	{
		gameobjects[2].x ++;
	}
	else
	if(gameobjects[2].x > gameobjects[0].x)
	{
		gameobjects[2].x --;
	}
	
	// Player y co-ord follow player code
	if(gameobjects[2].y < gameobjects[0].y)
	{
		gameobjects[2].y ++;
	}
	else
	if(gameobjects[2].y > gameobjects[0].y)
	{
		gameobjects[2].y --;
	}
}

// damage system for both enemy and player
function DamageSystem()
{
	var NewPosX = gameobjects[0].x - gameobjects[2].x;
	var NewPosY = gameobjects[0].y - gameobjects[2].y;

	if(NewPosX < DetectRange && NewPosY < DetectRange )
	{
		NPCMovement();
		
		if(NewPosX < NPCHitRange && NewPosY < NPCHitRange)
		{
			if(gameobjects[0].health > 0 && gameobjects[2].health > 0)
			{
				gameobjects[0].health -= 0.25;
			}
		}
	}
	
	if(gameobjects[0].health <= 0)
	{
		gameobjects[0].x = 0;
		gameobjects[0].y = 0;
		bg.src = DeathBGSRC;
	}
	
	if(gameobjects[2].health <= 0)
	{
		gameobjects[2].x = 0;
		gameobjects[2].y = 0;
		bg.src = WinBGSRC;
	}
	
	if(NewPosX < PlayerHitRange && NewPosY < PlayerHitRange )
	{
		if(isEPressed === true)
		{
			gameobjects[2].health -= 10;
		}
	}
}

//function for controlling input to move character
function update()
{
	if(gameobjects[0].health > 0)
	{
		// Updating position and gamestate of player
		if (gamerInput.action === "Up") {
			gameobjects[0].y = gameobjects[0].y - 10;
			//console.log("Player Up");
		}
		if (gamerInput.action === "Down") {
			gameobjects[0].y = gameobjects[0].y + 10;
			//console.log("Player Down");
		}  
		if (gamerInput.action === "Left") {
			gameobjects[0].x = gameobjects[0].x - 10;
			//console.log("Player Left");
		}  
		if (gamerInput.action === "Right") {
			gameobjects[0].x = gameobjects[0].x + 10;
			//console.log("Player Right");
		}
		if (gamerInput.action === "Space") {
			isEPressed = true;
			//console.log("Player Right");
		}
	}
	DamageSystem();
	CoinCollisions();
}

// Draw GameObjects to Console
// Modify to Draw to Screen
function draw()
{
    // Clear Canvas
    // Iterate through all GameObjects
    // Draw each GameObject
    // console.log("Draw");
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	//background image draw
	context.drawImage(bg,0,0,800,800);
	
	for (j = 0; j < coins.length; j++)
	{
		if(coins[j].PickedUp === false)
		{
			context.drawImage(coinImages[j], 0, 0, coinImages[j].width , coinImages[j].height, coins[j].x, coins[j].y, 75, 75);
		}
	}
	
    for (i = 0; i < gameobjects.length; i++)
	{
		if(gameobjects[i].name === "Stick")
		{
			if (gameobjects[0].health > 0)
			{
				
				animateStick();
				context.drawImage(images[1], (images[1].width / frames) * currentStickFrame, 0, (images[1].width / frames), images[1].height,(gameobjects[0].x + gameobjects[1].x),(gameobjects[0].y + gameobjects[1].y), 100, 100);
			}
		}
		else 
        if (gameobjects[i].health > 0)
		{
			//console.log("Image :" + gameobjects[i].img);
			//context.drawImage(images[i], gameobjects[i].x, gameobjects[i].y);
			animate();
		    context.drawImage(images[i], (images[i].width / frames) * currentFrame, 0, (images[i].width / frames), images[i].height, gameobjects[i].x, gameobjects[i].y, 150, 150);
		}
    }
	
	drawPlayerHealthbar();
	drawEnemyHealthbar();

}

//function for animating everything but stick
function animate()
{
	//animate function for animating sprites
    current = new Date().getTime(); // update current
    if (current - initial >= 500) { // check is greater that 500 ms
        currentFrame = (currentFrame + 1) % frames; // update frame
        initial = current; // reset initial
    } 
}

//gameplay loop
function gameloop()
{
    update();
    draw();
    window.requestAnimationFrame(gameloop);
}

//fucntion for animating the stick object
function animateStick()
{		
	if(isEPressed === true)
	{
		console.log("Playing stick anim");
		//setTimeout(function() {currentStickFrame = (currentStickFrame + 1) % frames;},1000) // update frame}
		
		if(currentStickFrame === frames - 1)
		{
			console.log("reset anim");
			isEPressed = false;
		}
		
		if(currentFrame < frames){
			currentStickFrame = (currentStickFrame + 1) % frames; // update frame
			context.drawImage(images[1], (images[1].width / frames) * currentStickFrame, 0, (images[1].width / frames), images[1].height,(gameobjects[0].x + gameobjects[1].x),(gameobjects[0].y + gameobjects[1].y), 100, 100);
			console.log(currentStickFrame);			
			setTimeout(function() {},500);// update frame}
		}
	}
}

//function for playing audio
function playButtonClick()
{
	
	if (localStorage.clickcount)
	{
		localStorage.clickcount = Number(localStorage.clickcount) + 1;
	} 
	else 
	{
		localStorage.clickcount = 1;
	}
	
	//if sound is finished, play
	if(mySound.paused)
	{
		mySound.play();
	}
	//else if not finished reset to start of audio 
	else
	{
		mySound.currentTime = 0;
	}
	
	document.getElementById("ClickText").innerHTML = "You have clicked any button " + localStorage.clickcount + " time(s).";
}

//function for playing Adding score
function AddScore()
{
	if (localStorage.ScoreCount)
	{
		localStorage.ScoreCount = Number(localStorage.ScoreCount) + 1;
	} 
	else 
	{
		localStorage.ScoreCount = 1;
	}
	
	document.getElementById("ScoreText").innerHTML = "Your Score: " + localStorage.ScoreCount + " !";
}

//function for detecting collisions for coins and Adding score
function CoinCollisions()
{
	if(gameobjects[0].health > 0)
	{
		for (j = 0; j < coins.length; j++)
		{
			if(coins[j].PickedUp === false)
			{
				var NewPosX = gameobjects[0].x - coins[j].x;
				var NewPosY = gameobjects[0].y - coins[j].y;

				if(NewPosX < 75 && NewPosY < 75 )
				{		
					coins[j].PickedUp = true;
					AddScore();
				}
			}
		}
	}
}

if (!localStorage.clickcount)
{
	localStorage.clickcount = 0;
} 

if (!localStorage.ScoreCount)
{
	localStorage.ScoreCount = 0;
} 

document.getElementById("ScoreText").innerHTML = "Your Score: " + localStorage.ScoreCount + " !";
document.getElementById("ClickText").innerHTML = "You have clicked any button " + localStorage.clickcount + " time(s).";

// Handle Active Browser Tag Animation
window.requestAnimationFrame(gameloop);
weaponSelection();