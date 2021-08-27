var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;
var canvas
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var bgImg;


function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  bgImg = loadImage("desert.jpg");
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  canvas = createCanvas(1200,400);
  
  trex = createSprite(50,350,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,350,1200,20);
  //ground.visible = false;
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(600,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(600,180);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

 
  invisibleGround = createSprite(200,350,1200,10);
  invisibleGround.visible = false;
  invisibleGround.x = invisibleGround.width/2;
  invisibleGround.velocityX = -(6 + 3*score/100);
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  

  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(bgImg);

  trex.x=camera.position.x-270;
  fill("red");
  text("Score: "+ score, 1000,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    score.velovityX=0;
  // trex.x=10; 
	trex.velocityX = 3
    
   
  gameOver.visible = false;
  restart.visible = false;
  
  if(score>0 && score%100 === 0){
    checkPointSound.play() 
 }
 
    
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
      jumpSound.play();
    }
	if(trex.x > 1000){
		trex.x = 20;
    //    obstaclesGroup.destroyEach();
    //    cloudsGroup.destroyEach();
	}
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x <600){
      ground.x = ground.width/2;
      invisibleGround.x = invisibleGround.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
      jumpSound.play();
      gameState = END;
      dieSound.play()
     }
	
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
	trex.velocityX = 0
	
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart) || keyDown("R")) {
      reset();
    }
  }
  else if (gameState === WIN) {
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
  }

  trex.collide(invisibleGround);
  if(score >= 1000){
    trex.visible = false;
    textSize(30);
    stroke(3);
    fill("brown");
    text("Congragulations!! You win the game!! ", 70,200);
    gameState = WIN;
  }
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(1300,120,40,10);
    cloud.shapeColor = "lightblue";
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(1300,320 ,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
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

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
   trex.x = 50
  
  score = 0;
  
}







