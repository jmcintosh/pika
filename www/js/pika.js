"use strict";
var width = screen.width;
var height = screen.height;
var scenesBuffer = 4; // the number of videos to buffer, before and after current scene
var keys = {};
var audio = {};
var speed = 1; //change speed of video, for testing purposes
var scene = 0; //initial scene
var fadeTime = 500; // time for fades on scene transitions
var font = "Helvetica";
var onIntro = true;
var introGroup = [];

var dimension = {
    top: 0,
    bottom: height,
    right: width,
    left: 0
};

// overwriting setExactFit function to maintain aspect ratio
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

var basicTextStyle = { 
    font: font, 
    fontSize: 24,
    fill: "white", 
    wordWrap: true, 
    wordWrapWidth: width*0.45, 
    align: "left" 
};


function preload() {
    film.stage.disableVisibilityChange = true;
    film.stage.backgroundColor = "#FFFFFF";
    film.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    film.scale.pageAlignHorizontally = false;
    film.scale.pageAlignVertically = false;
    film.scale.forceOrientation(true,false);
    
    film.load.audio('background', 'audio/placeholder.mp3');
    
    film.load.onFileComplete.add(fileComplete, this);
    for(var i = 0; i < scenesBuffer; i++){
        var item = scenes[i];
        film.load.video(item.title,item.url);
    }
    
    film.load.script('filters', 'js/filters.js');
    
    film.load.image('map','img/map.jpg');
    
    // keep it centered
    film.scale.setResizeCallback(onResize);
}



function create() {
    // Inputs
    keys.up = film.input.keyboard.addKey(Phaser.Keyboard.UP);
    keys.down = film.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    keys.left = film.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    keys.right = film.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    
    // audio
    audio.background = film.add.audio('background');
    film.sound.setDecodedCallback(audio.background, startAudio, this);
    
    //filters
    filters.blurX = this.add.filter('BlurX');
    filters.blurY = this.add.filter('BlurY');
    
    
    window.onfocus = onResize;
    
    doIntro();
}



function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles){
    for(var i = 0; i < scenes.length; i++){
        if(cacheKey === scenes[i].title){
            prepareVideo(scenes[i]);
            break;
        }
    }
}

function doIntro(){
    disableControls(12000);
    onIntro = true;
    // show image
    introGroup = film.add.group();
    var mapImage = film.add.image(width/2,height/2,'map');
    mapImage.anchor.set(0.5,0.5);
    var scalex = width/mapImage.width;
    var scaley = height/mapImage.height;
    var scale = Math.max(scalex,scaley);
    mapImage.scale.set(scale,scale);
    introGroup.add(mapImage);
    onResize();
    fadeIn(mapImage,fadeTime,film);
    
    var taxonomy = [
        "Anamalia",
        "Chordata",
        "Mammalia",
        "Lagomorpha",
        "Ochotonidae",
        "Ochotona princips"
    ];

    
    var taxonomyTextStyle = {
        font: font, 
        fontSize: 44,
        fill: "white", 
        wordWrap: false, 
        wordWrapWidth: width*0.45, 
        align: "left" 
    };
    
    var xSpacing = 30;
    var ySpacing = 60;
    var x = (width/2)-275;
    var y = (height/2)-250;
    var i = 0;
    var taxText = [];
    var interval = setInterval(function(){
        if(i >= taxonomy.length){ 
            clearInterval(interval);
            setTimeout(function(){
                showTitle();
                taxText.map(function(item){
                    film.add.tween(item).to( {alpha: 0.5}, 750, "Linear", true );
                });
            },250);
        }else{
            var text = film.add.text(x,y,taxonomy[i],taxonomyTextStyle);
            text.setShadow(3,3,'black',3);
            text.anchor.set(0,0);
            fadeIn(text,750,film);
            x += xSpacing;
            y += ySpacing;
            taxText.push(text);
            introGroup.add(text);
            i++;
        }
    },1000);
    
    var showTitle = function(){
        var title = "The American Pika";
        var subtitle = "Another Piece of the Puzzle";
        var titleTextStyle = {
            font: font, 
            fontSize: 60,
            fill: "white", 
            wordWrap: false, 
            wordWrapWidth: width*0.45, 
            align: "left" 
        };
        x-=3*xSpacing;
        var titleText = film.add.text(x,y,title,titleTextStyle);
        titleText.setShadow(3,3,'black',3);
        titleText.anchor.set(0,0);
        fadeIn(titleText,750,film);
        setTimeout(function(){
            var colon = film.add.text(x+titleText.width,y,':',titleTextStyle);
            colon.setShadow(3,3,'black',3);
            fadeIn(colon,750,film);
            var subtitleText = film.add.text(x+xSpacing,y+ySpacing,subtitle,taxonomyTextStyle);
            subtitleText.setShadow(3,3,'black',3);
            fadeIn(subtitleText,750,film);
            introGroup.add(titleText);
            introGroup.add(colon);
            introGroup.add(subtitleText);
        },1500);
        
        
    };
    
    
}

function start() {
    // center it
    //onResize();
    
    
//    var data = [
//            {item: 'Yes', count: 100},
//            {item: 'No', count: 587},
//            {item: 'Maybe', count: 300}
//            //{item: 'Dunno', count: 1},
//            //{item: 'I\'m scared', count: 20}
//        ];
//    var piechart = new PieChart(film, width/2, height/2, height/8, data);
//    piechart.animate();
    //piechart.draw();
}

function startAudio() {
    //audio.background.loopFull(0.3);
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
        prepareText(item);
    }
}

function prepareText(item){
    item.text = film.add.text(200,height-200,item.string,basicTextStyle);
    item.text.setShadow(2,2,'black',3);
    item.text.kill();
}

function destroyVideo(item){
    if(item.hasOwnProperty('image') && item.image !== undefined){
        item.image.destroy();
        delete item.image;
    }
    if(item.hasOwnProperty('video') &&  item.video !== undefined){
        item.video.destroy();
        delete item.image;
        if(film.cache.checkVideoKey(item.title)){
            film.cache.removeVideo(item.title);
        };
    }
    if(item.hasOwnProperty('text') && item.text !== undefined){
        item.text.destroy();
        delete item.text;
    }
}

function forward() {

    disableControls(fadeTime);
    
    if(onIntro){
        film.add.tween(introGroup).to( {alpha: 0}, fadeTime, "Linear", true );
        setTimeout(function(){
            introGroup.destroy();
        },fadeTime);
        
        onIntro = false;
        scene = 0;
        scenes[scene].video.onPlay.addOnce(start,this);
        fadeIn(scenes[scene].image, fadeTime, film);
        scenes[scene].video.play(true, speed);
        onResize();
    }else{
        var curScene = scenes[scene];
        if( !curScene.hasOwnProperty('text') || curScene.textIsShown ){

            if(scene === scenes.length-1){
                return;
            }

            // load video into buffer
            var sceneToLoad = scene + scenesBuffer;
            if(sceneToLoad < scenes.length){
                var item = scenes[sceneToLoad];
                if(item.image === undefined){
                    loadVideo(item);
                }
            }

            // destroy video outside buffer range
            var sceneToDestroy = ( scene - scenesBuffer ) + 1;
            if(sceneToDestroy >= 0){
                destroyVideo(scenes[sceneToDestroy]);
            }

            // changeScene
            var nextScene = scenes[scene+1];
            changeScene(curScene,nextScene);

            scene++;
            if( scene > scenes.length - 1 ) {
                scene = 0;
            }
        }else{ // show the text
            if( curScene.hasOwnProperty('text') ){
                curScene.textIsShown = true;
                fadeInText(curScene.text, fadeTime, film);
                addBlur(curScene.image, fadeTime, film);
            }
        }
    }
    

}

function back() {
    
    
    if(onIntro){
        return;
    }else{
        var curScene = scenes[scene];
        if(curScene.textIsShown){
            if( curScene.hasOwnProperty('text') ){
                curScene.textIsShown = false;
                fadeOutText(curScene.text, fadeTime, film, function(){curScene.text.kill();});
                removeBlur(curScene.image, fadeTime, film);
            }
        }else{

            if(scene === 0){
                doIntro();
                fadeOutCurrentScene(curScene);
                return;
            }
            disableControls(fadeTime);
            
            // load video into buffer
            var sceneToLoad = scene - scenesBuffer;
            if(sceneToLoad >= 0){
                var item = scenes[sceneToLoad];
                if(item.image === undefined){
                    loadVideo(item);
                }
            }

            // destroy video outside buffer range
            var sceneToDestroy = ( scene + scenesBuffer ) - 1;
            if(sceneToDestroy < scenes.length){
                destroyVideo(scenes[sceneToDestroy]);
            }


            // change scene
            var nextScene = scenes[scene-1];
            changeScene(curScene,nextScene);

            scene--;
            if( scene < 0 ) {
                scene = scenes.length-1;
            }
        }
    }
    
}

function changeScene(curScene,nextScene){
    
    // check if nextScene is ready
    if(nextScene.image === undefined){
        return;
    }
    fadeOutCurrentScene(curScene);
    fadeInNextScene(nextScene);
}

function fadeOutCurrentScene(curScene){
    if(curScene.hasOwnProperty('text')){
        fadeOutText(curScene.text, fadeTime, film, function(){curScene.text.kill();});
    }
    fadeOut(curScene.image, fadeTime, film, function () {
        curScene.image.kill();
        curScene.video.stop();
        curScene.textIsShown = false;
        removeBlur(curScene.image, fadeTime, film);
    });
    fadeOutVolumeOnVideo(curScene.video, fadeTime, film);
    
}

function fadeInNextScene(nextScene){
    fadeIn(nextScene.image, fadeTime, film);
    fadeInVolumeOnVideo(nextScene.video, fadeTime, film);
    nextScene.video.play(true,speed);
    
}

function disableControls(time){
    film.input.onDown.removeAll();
    
    keys.up.onDown.removeAll();
    keys.down.onDown.removeAll();
    keys.left.onDown.removeAll();
    keys.right.onDown.removeAll();
    
    film.input.mouse.mouseWheelCallback = null;
    setTimeout(enableControls, time);
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

function onResize(){
    if(film.scale.isFullScreen){
        dimension.top = 0;
        dimension.bottom = height;
        dimension.left = 0;
        dimension.right = width;
    }else{
        var scaleX = film.scale.scaleFactor.x;
        var scaleY = film.scale.scaleFactor.y;
        var x = (film.scale.width - window.innerWidth)/2;
        var y = (film.scale.height - window.innerHeight)/2;
        dimension.left = scaleX*x;
        dimension.right = scaleX*(film.scale.width - x);
        dimension.top = scaleY*y;
        dimension.bottom = scaleY*(film.scale.height - y);
        window.scrollTo(x,y);
        
    }
    if(scenes[scene].textIsShown){
        adjustText(scenes[scene].text);
    }
}

function update() {
    
}

function render() {

}