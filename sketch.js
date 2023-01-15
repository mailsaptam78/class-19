var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var coinsGroup, coinsImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  mario_running = loadAnimation("mario.png");
  mario_collided = loadAnimation("mario_collided image.png");
  
  groundImage = loadImage("ground2.png");
  
  coinsImage = loadImage("coin image.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
 console.log(message)
  
  mario = createSprite(50,160,20,50);
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  

  mario.scale = 0.1;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and coins Groups
  obstaclesGroup = createGroup();
  coinsGroup = createGroup();

  
  mario.setCollider("rectangle",0,0,100,mario.height);
  mario.debug = true;
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& mario.y >= 100) {
        mario.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    mario.velocityY = mario.velocityY + 0.8
  
    //spawn thecoins
    spawcoins();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(mario)){
        //mario.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the mario animation
      mario.changeAnimation("collided", mario_collided);
    
     
     
      ground.velocityX = 0;
      mario.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
  coinsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0); 
     if(mousePressedOver(restart)) {
      reset();
      
    }
   }
  
 
  //stop mario from falling down
  mario.collide(invisibleGround);
  
  


  drawSprites();
}

function reset(){
gameState = PLAY;
obstaclesGroup.destroyEach();coinsGroup.destroyEach();  
mario.changeAnimation("running",mario_running);
score = 0;
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawcoins() {
  //write code here to spawn thecoins
  if (frameCount % 60 === 0) {
    var coins = createSprite(600,120,40,10);
    coins.y = Math.round(random(80,120));
    coins.addImage(coinsImage);
    coins.scale = 0.1;
    coins.velocityX = -3;
    
     //assign lifetime to the variable
    coins.lifetime = 200;
    
    //adjust the depth
    coins.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each coins to the group
  coinsGroup.add(coins);
  }
}

