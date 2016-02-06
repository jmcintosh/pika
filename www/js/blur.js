
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update });


var blurKey;

function preload() {

    game.load.image('phaser', 'img/acryl_bladerunner.png');
    game.load.script('filters', 'js/filters.js');

}

function create() {

	var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
	logo.anchor.setTo(0.5, 0.5);
        game.logo = logo;

	game.blurX = game.add.filter('BlurX');
	game.blurY = game.add.filter('BlurY');
        
        blurKey = game.input.keyboard.addKey(Phaser.Keyboard.B);
        blurKey.onDown.add(addBlur,this);

}

function update() {
}

function addBlur() {
    game.logo.filters = [game.blurX, game.blurY];
}