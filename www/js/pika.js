var width = screen.width;
var height = screen.height;

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
    {'title': 'chrome',
     'url': 'video/chrome.webm',
     'string': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id dolor commodo, laoreet dui in, interdum urna.',
     'textIsShown': false
    },
    {'title': 'liquid',
     'url': 'video/liquid2.mp4',
     'string': 'There was a video of a flaming skull among these samples, but I found it tacky so I removed it.',
     'textIsShown': false
    },
    {'title': 'wormhole',
     'url': 'video/wormhole.mp4',
     'string': "This video won't loop for some reason. Perhaps we will never know why.",
     'textIsShown': false
    }
];

var speed = 1; //change speed of video, for testing purposes
var scene = 0; //initial scene
var fadeTime = 500; // time for fades on scene transitions


function preload() {
    
    film.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    film.scale.pageAlignHorizontally = true;
    film.scale.pageAlignVertically = true;
    film.scale.forceOrientation(true,false);
    
    film.load.audio('background', 'audio/placeholder.mp3');

    scenes.forEach(function(item,index,array) {
        film.load.video(item.title,item.url);
    });
    
    film.load.script('filters', 'js/filters.js');

}

function create() {
    
    film.stage.backgroundColor = "#FFFFFF";
    
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
            console.log("adding text\n");
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
    fullscreenKey.onDown.add(goFull,this);
    
    var piechart = new PieChart(film,width/2, height/2, height/4, 50,50 );
    piechart.draw();
}

function startAudio() {
    audio.background.loopFull(0);
}

function nextScene() {
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
        disableControls(fadeTime);
        if( scenes[scene].hasOwnProperty('text') ){
            fadeInText(scenes[scene].text,fadeTime);
            scenes[scene].textIsShown = true;
            addBlur(scenes[scene].image);
        }
    }
}

function prevScene() {
    disableControls(fadeTime);
    var curScene = scenes[scene];
    fadeOutText(curScene.text,fadeTime, function(){curScene.text.kill();});
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

function goFull() {
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
    image.y = height - 10;
    film.add.tween(image).to({y: height - 30}, time, "Linear", true);
    fadeIn(image, time);
}

function fadeOutText(image, time, callback) {
    film.add.tween(image).to({y: height - 10}, time, "Linear", true);
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
    image.filters = [filters.blurX, filters.blurY];
}

function removeBlur(image) {
    image.filters = null;
}

function render() {

    //film.debug.text("Video width: " + scenes[scene].video.video.videoWidth, 600, 32);
    //film.debug.text("Video height: " + scenes[scene].video.video.videoHeight, 600, 64);

    //film.debug.text("Video Time: " + scenes[scene].video.currentTime, 32, 32);
    //film.debug.text("Video Duration: " + scenes[scene].video.duration, 32, 64);

}
