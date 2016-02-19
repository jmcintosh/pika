"use strict";
var width = screen.width;
var height = screen.height;


// overriding setExactFit function to maintain aspect ratio
Phaser.ScaleManager.prototype.setExactFit = function () {
    var bounds = this.getParentBounds(this._tempBounds);
    var width = bounds.width;
    var height = bounds.height;

    var multiplier;

    multiplier = Math.max((height / this.game.height), (width / this.game.width));

    this.width = Math.round(this.game.width * multiplier);
    this.height = Math.round(this.game.height * multiplier);
};

var film = new Phaser.Game(
        width, 
        height, 
        Phaser.AUTO, 
        'body', 
        { preload: preload, create: create, update: update, render: render }
);

var filters = {};
var fullscreenKey;
var keys = {};
var audio = {};

var basicTextStyle = { font: "24px Arial", 
    fill: "#000000", 
    wordWrap: true, 
    wordWrapWidth: window.innerWidth/4, 
    align: "left" 
};


var scenes = [ 
    {'title': 'bigtruckinsnow',
     'url': 'video/BigTruckInSnow.mp4',
     'string': 'A truck will drive by in a moment. Keep watching.',
     'textIsShown': false
    },
    {'title': 'ennislake',
     'url': 'video/EnnisLake.mp4',
     'string': 'What a lovely lake. I\'ve never been here, believe it or not.',
     'textIsShown': false
    },
    {'title': 'madisonriver',
     'url': 'video/MadisonRiver.mp4',
     'string': "Looks cold. I would prefer to not go swimming.",
     'textIsShown': false
    },
    {'title': 'pallisadefalls',
     'url': 'video/PallisadeFalls.mp4',
     'string': 'There are actually 11 pikas in this shot. Can you spot them all?',
     'textIsShown': false
    },
    {'title': 'snowglitter',
     'url': 'video/SnowGlitter.mp4',
     'string': 'I noticed that the blur effect is way too abrupt. I should figure out how to blur it gradually.',
     'textIsShown': false
    },
    {'title': 'sunsethyalite',
     'url': 'video/SunsetHyalite.mp4',
     'string': 'Something unnatural about the sky. Doesn\'t seem right some how.',
     'textIsShown': false
    },
    {'title': 'woodlandsnowycreek',
     'url': 'video/WoodlandSnowyCreek.mp4',
     'string': 'None of the videos are looping. I need to figure out why.',
     'textIsShown': false
    }
];

var speed = 1; //change speed of video, for testing purposes
var scene = 0; //initial scene
var fadeTime = 500; // time for fades on scene transitions


function preload() {
    film.stage.disableVisibilityChange = true;
    film.stage.backgroundColor = "#FFFFFF";
    film.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

    film.scale.pageAlignHorizontally = false;
    film.scale.pageAlignVertically = false;
    film.scale.forceOrientation(true,false);
    
    film.load.audio('background', 'audio/placeholder.mp3');

    scenes.forEach(function(item,index,array) {
        film.load.video(item.title,item.url);
    });
    
    film.load.script('filters', 'js/filters.js');
    
    
    // keep it centered
    window.onresize = function(event){
        var x = (film.scale.width - window.innerWidth)/2;
        var y = (film.scale.height - window.innerHeight)/2;
        window.scrollTo(x,y);
    };

}

function create() {
    // Inputs
    fullscreenKey = film.input.keyboard.addKey(Phaser.Keyboard.F);
    keys.up = film.input.keyboard.addKey(Phaser.Keyboard.UP);
    keys.down = film.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    keys.left = film.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    keys.right = film.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    keys.w = film.input.keyboard.addKey(Phaser.Keyboard.W);
    keys.a = film.input.keyboard.addKey(Phaser.Keyboard.A);
    keys.s = film.input.keyboard.addKey(Phaser.Keyboard.S);
    keys.d = film.input.keyboard.addKey(Phaser.Keyboard.D);
    //keys.blurKey = film.input.keyboard.addKey(Phaser.Keyboard.B);
    
    // Scenes
    scenes.forEach(function(item,index,array) {
        var video = film.add.video(item.title);
        item.video = video;
        var scalex = width/video.video.videoWidth;
        var scaley = height/video.video.videoHeight;
        var scale = Math.max(scalex,scaley);
        item.image = video.addToWorld(width/2,height/2,0.5,0.5,scale,scale);
        if( item.hasOwnProperty('string') ){
            item.text = film.add.text(200,height-200,item.string,basicTextStyle);
            item.text.anchor.set(0);
            item.text.kill();
        }
        item.image.kill();
    });
    
    // audio
    audio.background = film.add.audio('background');
    film.sound.setDecodedCallback(audio.background, startAudio, this);
    
    //filters
    filters.blurX = this.add.filter('BlurX');
    filters.blurY = this.add.filter('BlurY');
    
    scenes[scene].video.onPlay.addOnce(start,this);
    fadeIn(scenes[scene].image,fadeTime);
    scenes[scene].video.play(true,speed);
    
    
}

function update() {
    
}

function start() {

    //  hot keys
    enableControls();
    fullscreenKey.onDown.add(toggleFullScreen,this);
    
//    var piechart = new PieChart(film,width/2, height/2, height/4, 50,50 );
//    piechart.draw();
}

function startAudio() {
    audio.background.loopFull(0.5);
}

function toggleBackgroundAudio() {
    console.log("clicked");
    var newState = !audio.background.mute;
    audio.background.mute = newState;
    return newState;
};


function nextScene() {
    disableControls(fadeTime);
    if(scenes[scene].textIsShown){
        var curScene = scenes[scene];
        fadeOutText(curScene.text,fadeTime, function(){curScene.text.kill();});
        fadeOut(curScene.image, fadeTime, function () {
            curScene.image.kill();
            curScene.video.stop();
            curScene.textIsShown = false;
            removeBlur(curScene.image);
        });
        fadeOutVolumeOnVideo(curScene.video, fadeTime);

        scene++;
        if( scene > scenes.length - 1 ) {
            scene = 0;
        }
        
        fadeIn(scenes[scene].image,fadeTime);
        fadeInVolumeOnVideo(scenes[scene].video,fadeTime);
        scenes[scene].video.play(true,speed);

        
    }else{ // show the text
        if( scenes[scene].hasOwnProperty('text') ){
            scenes[scene].textIsShown = true;
            fadeInText(scenes[scene].text,fadeTime);
            addBlur(scenes[scene].image);
        }
    }
}

function prevScene() {
    disableControls(fadeTime);
    var curScene = scenes[scene];
    if(scenes[scene].textIsShown){
        if( scenes[scene].hasOwnProperty('text') ){
            curScene.textIsShown = false;
            fadeOutText(curScene.text, fadeTime, function(){curScene.text.kill();});
            removeBlur(curScene.image);
        }
    }else{
        fadeOutText(curScene.text, fadeTime, function(){curScene.text.kill();});
        fadeOut(scenes[scene].image, fadeTime, function () {
            curScene.image.kill();
            curScene.video.stop();
            curScene.textIsShown = false;
            removeBlur(curScene.image);
        });
        fadeOutVolumeOnVideo(curScene.video, fadeTime);

        scene--;
        if( scene < 0 ) {
            scene = scenes.length-1;
        }

        fadeIn(scenes[scene].image,fadeTime);
        fadeInVolumeOnVideo(scenes[scene].video,fadeTime);
        scenes[scene].video.play(true,speed);
        
    }
    
}

function disableControls(time){
    film.input.onDown.removeAll();
    
    keys.up.onDown.removeAll();
    keys.down.onDown.removeAll();
    keys.left.onDown.removeAll();
    keys.right.onDown.removeAll();
    keys.w.onDown.removeAll();
    keys.a.onDown.removeAll();
    keys.s.onDown.removeAll();
    keys.d.onDown.removeAll();
    
    film.input.mouse.mouseWheelCallback = null;
    setTimeout(function () {enableControls();
                            }, time);
}

function enableControls(){
    film.input.onDown.add(nextScene, this);
    
    keys.up.onDown.add(prevScene, this);
    keys.down.onDown.add(nextScene, this);
    keys.left.onDown.add(prevScene, this);
    keys.right.onDown.add(nextScene, this);
    keys.w.onDown.add(prevScene, this);
    keys.a.onDown.add(prevScene, this);
    keys.s.onDown.add(nextScene, this);
    keys.d.onDown.add(nextScene, this);
    
    enableMousewheel();
}

function enableMousewheel(){
    film.input.mouse.mouseWheelCallback = function(event) {
        if( film.input.mouse.wheelDelta === Phaser.Mouse.WHEEL_UP ){
            prevScene();
        }else{
            nextScene();
        }
    };
}

function toggleFullScreen() {
    if(film.scale.isFullScreen){
        film.scale.stopFullScreen();
    }else{
        film.scale.startFullScreen(false);
    }
}

function fadeIn(image, time) {
    image.alpha = 0;
    image.revive();
    film.add.tween(image).to( {alpha: 1}, time, "Linear", true );
}

function fadeOut(image, time, callback) {
    film.add.tween(image).to( {alpha: 0}, time, "Linear", true );
    setTimeout(callback,time);
}

function fadeInText(image, time) {
    image.anchor.x = 0;
    image.anchor.y = 1;
    image.x = 40;
    image.y = window.innerHeight - 10;
    film.add.tween(image).to({y: window.innerHeight - 30}, time, "Linear", true);
    fadeIn(image, time);
}

function fadeOutText(image, time, callback) {
    film.add.tween(image).to({y: image.y + 30}, time, "Linear", true);
    fadeOut(image, time, callback);
}

function fadeInVolumeOnVideo(video, time, max){
    if(max === undefined) max = 1;
    video.volume = 0;
    film.add.tween(video).to( {volume: max}, time, "Linear", true);
    
}

function fadeOutVolumeOnVideo(video, time){
    film.add.tween(video).to( {volume: 0}, time, "Linear", true);
    
}

function addBlur(image) {
    filters.blurX.uniforms.blur.value  = 0;
    filters.blurY.uniforms.blur.value  = 0;
    image.filters = [filters.blurX, filters.blurY];
    film.add.tween(filters.blurX.uniforms.blur).to({value: 1/512},fadeTime,"Linear",true);
    film.add.tween(filters.blurY.uniforms.blur).to({value: 1/512},fadeTime,"Linear",true);
}

function removeBlur(image) {
    film.add.tween(filters.blurX.uniforms.blur).to({value: 0},fadeTime,"Linear",true);
    film.add.tween(filters.blurY.uniforms.blur).to({value: 0},fadeTime,"Linear",true);
    
    setTimeout(function(){image.filters = null;},fadeTime);
}

function render() {

    //film.debug.text("Video width: " + scenes[scene].video.video.videoWidth, 600, 32);
    //film.debug.text("Video height: " + scenes[scene].video.video.videoHeight, 600, 64);

    //film.debug.text("Video Time: " + scenes[scene].video.currentTime, 32, 32);
    //film.debug.text("Video Duration: " + scenes[scene].video.duration, 32, 64);

}
