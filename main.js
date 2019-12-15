var game = new Phaser.Game(1000,600,Phaser.CANVAS,'');

var cursors;
var spacefield;
var backgroundv = +3;
var player;
var bullets;
var bulletTime=0;
var fireButton;

var enemies;

var score = 0;
var scoreText;
var winText;


var mainState = {
	preload:function(){
		game.load.image('starfield',"assets/starfield.png");
		game.load.image('player',"assets/player.png");
		game.load.image('bullet',"assets/laserGreen.png");
		game.load.image('enemy',"assets/enemyShip.png");
	},

	create:function(){
		spacefield = game.add.tileSprite(0,0,1000,600,'starfield');
		player = game.add.sprite(500-50,500,'player');
		game.physics.enable(player,Phaser.Physics.ARCADE);
		cursors = game.input.keyboard.createCursorKeys();

		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(30,'bullet');
		bullets.setAll('anchor.x',1);
		bullets.setAll('anchor.y',1);
		bullets.setAll('outOfBoundsKill',true);
		bullets.setAll('checkWorldBounds',true);
		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		enemies = game.add.group();
		enemies.enableBody = true;
		enemies.physicsBodyType = Phaser.Physics.ARCADE;
		createEnemies();

		scoreText = game.add.text(0,550,'Score :',{font: '32px Verdana',fill: '#fff'});
		winText = game.add.text(game.world.centerX,game.world.centerY,'You Win!',{font: '32px Verdana',fill: '#fff'});
		winText.visible = false;
	},

	update:function(){

		game.physics.arcade.overlap(bullets,enemies,collisionHandler,null,this);

		player.body.velocity.x = 0;
		spacefield.tilePosition.y += backgroundv;
		if(cursors.left.isDown){
			if(player.x > 0){
				player.body.velocity.x = -500;
			}
			
		}
		if(cursors.right.isDown){
			
			if(player.x < 950){
				player.body.velocity.x = +500;
			}
		}
		if(fireButton.isDown){
			fireBullet();
		}
		scoreText.text = 'Score :'+score;
		if(score >= 600){
			winText.visible = true;
			scoreText.visible = false;
		}
	},
}
function fireBullet(){
	if(game.time.now > bulletTime){
		bullet = bullets.getFirstExists(false);
		if(bullet){
		bullet.reset(player.x +52,player.y);
		bullet.body.velocity.y = -5000;
		bulletTime = game.time.now + 200;
		}
	}
}

function createEnemies(){
	for(var y = 0; y<2;y++){
		for(var x = 0; x<3;x++){
			var enemy = enemies.create(x*100,y*100,'enemy');
			enemy.anchor.setTo(1,1);
		}
	}
	enemies.x = 100;
	enemies.y =50;
	var tween = game.add.tween(enemies).to({x:700},2000,Phaser.Easing.Linear.None,true,10,10000,true);
	tween.onLoop.add(descend,this); 

}
function descend(){
	enemies.y += 10;
}
function collisionHandler(bullet,enemy){
	bullet.kill();
	enemy.kill();
	score += 100;
}

game.state.add('mainState',mainState);
game.state.start('mainState');