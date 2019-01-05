const canvas = document.getElementById('pong');
const context  = canvas.getContext("2d");
//user paddle
const user = {
  x: 0,
  y:canvas.height/2 - 100/2,
  width:10,
  height:100,
  color:"white",
  score:0,
}

//com paddle
const com = {
  x: canvas.width - 10,
  y:canvas.height/2 - 100/2,
  width:10,
  height:100,
  color:"white",
  score:0,
}

//create ball
const ball = {
  x:canvas.width/2,
  y:canvas.height/2,
  radius:10,
  speed:5,
  velocityX:5,
  velocityY:5,
  color:"white"
}
//draw Rect function
function drawRect(x,y,w,h,color) {
  context.fillStyle = color;
  context.fillRect(x,y,w,h);

}

drawRect(0,0,canvas.width,canvas.height,"black");
// draw circle function

function drawCircle(x,y,r,color)
{
  context.fillStyle = color;
  context.beginPath();
  context.arc(x,y,r,0,Math.PI*2,false);
  context.closePath();
  context.fill();
}

const net = {
  x:canvas.width/2 - 1,
  y:0,
  width:2,
  height:10,
  color:"white"
}

//draw net
function drawNet() {
  for(let i =0;i<=canvas.height;i+=15)
  {
    drawRect(net.x,i,net.width,net.height,net.color);
  }
}
// draw text function

function drawText(text,x,y,color) {
  context.fillStyle = color;
  context.font = "45px fantasy";
  context.fillText(text,x,y);
}

//control paddle

canvas.addEventListener("mousemove",movePaddle);

function movePaddle(evt){
  var rect = canvas.getBoundingClientRect();

  user.y = evt.clientY - rect.top - user.height/2;
}

function render() {
  //clear canvas
  drawRect(0,0,canvas.width,canvas.height,"black");

  //draw net
  drawNet();

  //draw score
  drawText(user.score,canvas.width/4,canvas.height/5,"white");
  drawText(com.score,3*canvas.width/4,canvas.height/5,"white");

  //draw paddle

  drawRect(user.x,user.y,user.width,user.height,user.color);
  drawRect(com.x,com.y,com.width,com.height,com.color);

  //draw the ball
  drawCircle(ball.x,ball.y,ball.radius,ball.color);
}

function collision(b,p){
  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top <p.bottom;
}

function resetBall()
{
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2 ;
  ball.speed = 5;
  ball.velocityX = -ball.velocityX;
}
function resetBallComletely()
{
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2 ;
  ball.speed = 5;
  ball.velocityX = 5;
  ball.velocityY = 5;
}

function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  let computerLevel = 0.1;
  com.y += (ball.y -(com.y + com.height/2))*computerLevel;
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;

  }

  let player = (ball.x<canvas.width/2)? user:com;

  if (collision(ball,player)) {
    //where the ball hit the player
    let collidePoint = ball.y - (player.y + player.height/2);
    collidePoint = collidePoint/(player.height/2);

    let angleRad = collidePoint*Math.PI/4;

    let direction = (ball.x < canvas.width/2) ? 1:-1;

    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    ball.speed += 0.1;


  }

  if(ball.x - ball.radius < 0)
  {
    com.score++;
    document.querySelector("body").classList.add("red-glow");
    setTimeout(function(){
      document.querySelector("body").classList.remove("red-glow");
    },1000)
    resetBall();
  }
  else if(ball.x + ball.radius>canvas.width)
  {
    user.score++;
    document.querySelector("body").classList.add("green-glow");
    setTimeout(function(){
      document.querySelector("body").classList.remove("green-glow");
    },1000)
    resetBall();
  }
  if(user.score === 10)
  {
      ResetGame();
      document.querySelector(".status").innerHTML = "User has  won the game";

  }
  else if (com.score === 10 ) {

        ResetGame();
        document.querySelector(".status").innerHTML = "Com has  won the game,you lose";


  }


}

var gameStatus;
var startCheck = false;

function game(){
  update();
  render();
}


function startGame() {
    if(!startCheck)
    {
    document.querySelector('.status').innerHTML = "Game has been started";
    gameStatus = setInterval(game,1000/50);
    startCheck = true;
    }
}

function pauseGame()
{
  console.log("Game has been paused");
  clearInterval(gameStatus);
  if(startCheck)
  {
    document.querySelector(".status").innerHTML = "Game has been paused";
    startCheck = false;
  }
}

function ResetGame()
{
  console.log("Game is been resetted");
  user.score = 0;
  com.score = 0;
  if(startCheck)
  {
    document.querySelector(".status").innerHTML = "Game has been resetted";
    startCheck = false;
  }
  //paddle should be resetted
  user.y = canvas.height/2 - 100/2;
  com.y = canvas.height/2 - 100/2;

  resetBallComletely();
  clearInterval(gameStatus);
  render();

}


render();
document.getElementById('pauseButton').addEventListener("click",pauseGame);
document.getElementById("startBtn").addEventListener("click",startGame);
document.getElementById("ResetButton").addEventListener("click",ResetGame);

// pause using space bar
document.querySelector("body").addEventListener("keydown",startSpaceBar);

function startSpaceBar(evt) {
  if(startCheck && evt.code === "Space")
  {
    pauseGame();
  }
  else if (!startCheck && evt.code === "Space") {
    startGame();
  }
  else if(evt.code === "Enter")
  {
    ResetGame();
  }
}
