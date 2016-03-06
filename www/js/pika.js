//"use strict";
var width = screen.width;
var height = screen.height;
var scenesBuffer = 4; // the number of videos to buffer, before and after current scene
var keys = {};
var audio = {};
var speed = 1; //change speed of video, for testing purposes
var scene = 0; //initial scene
var fadeTime = 500; // time for fades on scene transitions

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

var basicTextStyle = { font: "24px Helvetica", 
    fill: "#FFFFFF", 
    wordWrap: true, 
    wordWrapWidth: window.innerWidth/4, 
    align: "left" 
};


var scenes = [
    {
        "string": "Placeholder string for BigTruckInSnow.mp4", 
        "textIsShown": false, 
        "title": "BigTruckInSnow", 
        "url": "video/BigTruckInSnow.mp4"
    }, 
    {
        "string": "Placeholder string for DenTallusWS.mp4", 
        "textIsShown": false, 
        "title": "DenTallusWS", 
        "url": "video/DenTallusWS.mp4"
    }, 
    {
        "string": "Placeholder string for EnnisLake.mp4", 
        "textIsShown": false, 
        "title": "EnnisLake", 
        "url": "video/EnnisLake.mp4"
    }, 
    {
        "string": "Placeholder string for FallColorPikaHabitat.mp4", 
        "textIsShown": false, 
        "title": "FallColorPikaHabitat", 
        "url": "video/FallColorPikaHabitat.mp4"
    }, 
    {
        "string": "Placeholder string for FallColorPikaHabitat2.mp4", 
        "textIsShown": false, 
        "title": "FallColorPikaHabitat2", 
        "url": "video/FallColorPikaHabitat2.mp4"
    }, 
    {
        "string": "Placeholder string for GallatinRiver.mp4", 
        "textIsShown": false, 
        "title": "GallatinRiver", 
        "url": "video/GallatinRiver.mp4"
    }, 
    {
        "string": "Placeholder string for GraaWind.mp4", 
        "textIsShown": false, 
        "title": "GraaWind", 
        "url": "video/GraaWind.mp4"
    }, 
    {
        "string": "Placeholder string for IceIceBaby.mp4", 
        "textIsShown": false, 
        "title": "IceIceBaby", 
        "url": "video/IceIceBaby.mp4"
    }, 
    {
        "string": "Placeholder string for Pallisade.mp4", 
        "textIsShown": false, 
        "title": "Pallisade", 
        "url": "video/Pallisade.mp4"
    }, 
    {
        "string": "Placeholder string for PikaDen.mp4", 
        "textIsShown": false, 
        "title": "PikaDen", 
        "url": "video/PikaDen.mp4"
    }, 
    {
        "string": "Placeholder string for PikaEatsLichenSM.mp4", 
        "textIsShown": false, 
        "title": "PikaEatsLichenSM", 
        "url": "video/PikaEatsLichenSM.mp4"
    }, 
    {
        "string": "Placeholder string for PikaEatsYellowFlowers.mp4", 
        "textIsShown": false, 
        "title": "PikaEatsYellowFlowers", 
        "url": "video/PikaEatsYellowFlowers.mp4"
    }, 
    {
        "string": "Placeholder string for PikaEatsYellowFlowers2.mp4", 
        "textIsShown": false, 
        "title": "PikaEatsYellowFlowers2", 
        "url": "video/PikaEatsYellowFlowers2.mp4"
    }, 
    {
        "string": "Placeholder string for PikaHaysGreenStems.mp4", 
        "textIsShown": false, 
        "title": "PikaHaysGreenStems", 
        "url": "video/PikaHaysGreenStems.mp4"
    }, 
    {
        "string": "Placeholder string for PikaHaysYellowFlowers.mp4", 
        "textIsShown": false, 
        "title": "PikaHaysYellowFlowers", 
        "url": "video/PikaHaysYellowFlowers.mp4"
    }, 
    {
        "string": "Placeholder string for PikaHaysYellowFlowers2.mp4", 
        "textIsShown": false, 
        "title": "PikaHaysYellowFlowers2", 
        "url": "video/PikaHaysYellowFlowers2.mp4"
    }, 
    {
        "string": "Placeholder string for PikaonRock.mp4", 
        "textIsShown": false, 
        "title": "PikaonRock", 
        "url": "video/PikaonRock.mp4"
    }, 
    {
        "string": "Placeholder string for PikaPurpleFlower.mp4", 
        "textIsShown": false, 
        "title": "PikaPurpleFlower", 
        "url": "video/PikaPurpleFlower.mp4"
    }, 
    {
        "string": "Placeholder string for SnowGlitter.mp4", 
        "textIsShown": false, 
        "title": "SnowGlitter", 
        "url": "video/SnowGlitter.mp4"
    }, 
    {
        "string": "Placeholder string for SunsetHyalite.mp4", 
        "textIsShown": false, 
        "title": "SunsetHyalite", 
        "url": "video/SunsetHyalite.mp4"
    }, 
    {
        "string": "Placeholder string for Tallus.mp4", 
        "textIsShown": false, 
        "title": "Tallus", 
        "url": "video/Tallus.mp4"
    }, 
    {
        "string": "Placeholder string for TreeNHeat.mp4", 
        "textIsShown": false, 
        "title": "TreeNHeat", 
        "url": "video/TreeNHeat.mp4"
    }, 
    {
        "string": "Placeholder string for Weasel.mp4", 
        "textIsShown": false, 
        "title": "Weasel", 
        "url": "video/Weasel.mp4"
    }, 
    {
        "string": "Placeholder string for WoodSnow.mp4", 
        "textIsShown": false, 
        "title": "WoodSnow", 
        "url": "video/WoodSnow.mp4"
    }
];

function preload() {
    film.stage.disableVisibilityChange = true;
    film.stage.backgroundColor = "#FFFFFF";
    film.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    film.scale.pageAlignHorizontally = false;
    film.scale.pageAlignVertically = false;
    film.scale.forceOrientation(true,false);
    
    film.load.audio('background', 'audio/placeholder.mp3');
    
    for(var i = 0; i < scenesBuffer; i++){
        var item = scenes[i];
        film.load.video(item.title,item.url);
    }
    
//    scenes.forEach(function(item,index,array) {
//        film.load.video(item.title,item.url);
//    });
    
    film.load.script('filters', 'js/filters.js');
    
    
    // keep it centered
    window.onresize = function(event){
        var x = (film.scale.width - window.innerWidth)/2;
        var y = (film.scale.height - window.innerHeight)/2;
        window.scrollTo(x,y);
    };

}

function create() {
    
    film.load.onFileComplete.add(fileComplete, this);
    
    // Inputs
    keys.up = film.input.keyboard.addKey(Phaser.Keyboard.UP);
    keys.down = film.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    keys.left = film.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    keys.right = film.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    
    // Scenes
    for(var i = 0; i < scenesBuffer; i++){
        prepareVideo(scenes[i]);
    }
    
    
    // audio
    audio.background = film.add.audio('background');
    film.sound.setDecodedCallback(audio.background, startAudio, this);
    
    //filters
    filters.blurX = this.add.filter('BlurX');
    filters.blurY = this.add.filter('BlurY');
    
    scenes[scene].video.onPlay.addOnce(start,this);
    fadeIn(scenes[scene].image, fadeTime, film);
    scenes[scene].video.play(true, speed);
}

function update() {
    
}

function render() {

    //film.debug.text("Video width: " + scenes[scene].video.video.videoWidth, 600, 32);
    //film.debug.text("Video height: " + scenes[scene].video.video.videoHeight, 600, 64);

    //film.debug.text("Video Time: " + scenes[scene].video.currentTime, 32, 32);
    //film.debug.text("Video Duration: " + scenes[scene].video.duration, 32, 64);

}

function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles){
    for(var i = 0; i < scenes.length; i++){
        if(cacheKey === scenes[i].title){
            prepareVideo(scenes[i]);
            break;
        }
    }
}

function start() {

    //  hot keys
    enableControls();
    
//    var piechart = new PieChart(film,width/2, height/2, height/4, 50,50 );
//    piechart.draw();
}

function startAudio() {
    audio.background.loopFull(0.3);
}

function toggleBackgroundAudio() {
    var newState = !audio.background.mute;
    audio.background.mute = newState;
    return newState;
};

function loadVideo(item) {
    film.load.video(item.title,item.url);
    film.load.start();
}

function prepareVideo(item){
    var video = film.add.video(item.title);
    item.video = video;
    var scalex = width/video.video.videoWidth;
    var scaley = height/video.video.videoHeight;
    var scale = Math.max(scalex,scaley);
    item.image = video.addToWorld(width/2,height/2,0.5,0.5,scale,scale);
    item.image.kill();
    if( item.hasOwnProperty('string') ){
        item.text = film.add.text(200,height-200,item.string,basicTextStyle);
        item.text.anchor.set(0);
        item.text.kill();
    }
}

function destroyVideo(item){
//    if(item.image !== undefined || item.image !== null){
//        item.image.destroy();
//        item.image = null;
//    }
//    if(item.video !== undefined || item.video !== null){
//        item.video.destroy();
//        item.video = null;
//        if(film.cache.checkVideoKey(item.title)){
//            film.cache.removeVideo(item.title);
//        };
//    }
//    if(item.text !== undefined || item.text !== null){
//        item.text.destroy();
//        item.text = null;
//    }
}

function forward() {
    
    disableControls(fadeTime);
    
    if(scenes[scene].textIsShown){
        
        if(scene === scenes.length-1){
            return;
        }
        
        // check if next scene is prepared
        var nextScene = scenes[scene+1];
        if(nextScene.image === undefined || nextScene.image === null){
            return;
        }
        
        // load video into buffer
        var sceneToLoad = scene + scenesBuffer;
        if(sceneToLoad < scenes.length){
            var item = scenes[sceneToLoad];
            if(item.image === undefined || item.image === null){
                loadVideo(item);
            }
        }

        // destroy video outside buffer range
        var sceneToDestroy = ( scene - scenesBuffer ) + 1;
        if(sceneToDestroy >= 0){
            destroyVideo(scenes[sceneToDestroy]);
        }
        

        
        var curScene = scenes[scene];
        fadeOutText(curScene.text,fadeTime, film, function(){curScene.text.kill();});
        fadeOut(curScene.image, fadeTime, film, function () {
            curScene.image.kill();
            curScene.video.stop();
            curScene.textIsShown = false;
            removeBlur(curScene.image, fadeTime, film);
        });
        fadeOutVolumeOnVideo(curScene.video, fadeTime, film);
    
        scene++;
        if( scene > scenes.length - 1 ) {
            scene = 0;
        }
        
        fadeIn(scenes[scene].image, fadeTime, film);
        fadeInVolumeOnVideo(scenes[scene].video, fadeTime, film);
        scenes[scene].video.play(true, speed);

        
    }else{ // show the text
        if( scenes[scene].hasOwnProperty('text') ){
            scenes[scene].textIsShown = true;
            fadeInText(scenes[scene].text, fadeTime, film);
            addBlur(scenes[scene].image, fadeTime, film);
        }
    }
    

}

function back() {
    
    disableControls(fadeTime);
    var curScene = scenes[scene];
    if(scenes[scene].textIsShown){
        if( scenes[scene].hasOwnProperty('text') ){
            curScene.textIsShown = false;
            fadeOutText(curScene.text, fadeTime, film, function(){curScene.text.kill();});
            removeBlur(curScene.image, fadeTime, film);
        }
    }else{
        
        if(scene === 0){
            return;
        }
        
        // check if next scene is ready
        var nextScene = scenes[scene-1];
        if(nextScene.image === undefined || nextScene.image === null){
            return;
        }
        
        // load video into buffer
        var sceneToLoad = scene - scenesBuffer;
        if(sceneToLoad >= 0){
            var item = scenes[sceneToLoad];
            if(item.image === undefined || item.image === null){
                loadVideo(item);
            }
        }

        // destroy video outside buffer range
        var sceneToDestroy = ( scene + scenesBuffer ) - 1;
        if(sceneToDestroy < scenes.length){
            destroyVideo(scenes[sceneToDestroy]);
        }
        
        var nextScene = scenes[scene-1];
        if(nextScene.image === undefined || nextScene.image === null){
            return;
        }
        
        fadeOutText(curScene.text, fadeTime, film, function(){curScene.text.kill();});
        fadeOut(scenes[scene].image, fadeTime, film, function () {
            curScene.image.kill();
            curScene.video.stop();
            curScene.textIsShown = false;
            removeBlur(curScene.image, fadeTime, film);
        });
        fadeOutVolumeOnVideo(curScene.video, fadeTime, film);

        scene--;
        if( scene < 0 ) {
            scene = scenes.length-1;
        }


        fadeIn(scenes[scene].image, fadeTime, film);
        fadeInVolumeOnVideo(scenes[scene].video, fadeTime, film);
        scenes[scene].video.play(true,speed);
        
    }
    
}

function disableControls(time){
    film.input.onDown.removeAll();
    
    keys.up.onDown.removeAll();
    keys.down.onDown.removeAll();
    keys.left.onDown.removeAll();
    keys.right.onDown.removeAll();
    
    film.input.mouse.mouseWheelCallback = null;
    setTimeout(function () {enableControls();
                            }, time);
}

function enableControls(){
    film.input.onDown.add(forward, this);
    
    keys.up.onDown.add(back, this);
    keys.down.onDown.add(forward, this);
    keys.left.onDown.add(back, this);
    keys.right.onDown.add(forward, this);
    
    enableMousewheel();
}

function enableMousewheel(){
    film.input.mouse.mouseWheelCallback = function(event) {
        if( film.input.mouse.wheelDelta === Phaser.Mouse.WHEEL_UP ){
            back();
        }else if( film.input.mouse.wheelDelta === Phaser.Mouse.WHEEL_DOWN ){
            forward();
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

