"use strict";
var width = screen.width;
var height = screen.height;
var scenesBuffer = 4; // the number of videos to buffer, before and after current scene
var keys = {};
var speed = 1; //change speed of video, for testing purposes
var scene = 0; //initial scene
var fadeTime = 500; // time for fades on scene transitions
var font = "Pompiere";
var states ={
    'intro': 0,
    'instructions': 1,
    'scenes': 2,
    'questions': 3,
    'credits': 4,
    'facts': 5  
};
var state = states.intro;
var introGroup = [];
var audioReady = false;
var dimension = {
    top: 0,
    bottom: height,
    right: width,
    left: 0
};

var basicTextStyle = { 
    font: font, 
    fontSize: 0.03*height,
    fill: "white", 
    wordWrap: true, 
    wordWrapWidth: width*0.45, 
    align: "left" 
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


function preload() {    
    film.stage.disableVisibilityChange = true;
    film.stage.backgroundColor = "#FFFFFF";
    film.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    film.scale.pageAlignHorizontally = false;
    film.scale.pageAlignVertically = false;
    film.scale.forceOrientation(true,false);
    
    film.load.audio('background', 'audio/song.mp3');
    
    film.load.onFileComplete.add(fileComplete, this);
    for(var i = 0; i < scenesBuffer; i++){
        var item = scenes[i];
        film.load.video(item.title,item.url);
    }
    
    var audioKeys = Object.keys(audioClips);
    for(var i = 0; i < audioKeys.length; i++){
        var key = audioKeys[i];
        var clip = audioClips[key];
        film.load.audio(key,clip.url);
    }
    
    
    film.load.script('filters', 'js/filters.js');
    
    film.load.image('intro','img/intro.jpg');
    
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
    //audio.background = film.add.audio('background');
    //film.sound.setDecodedCallback(audio.background, startAudio, this);
    var sounds = [];
    var audioKeys = Object.keys(audioClips);
    for(var i = 0; i < audioKeys.length; i++){
        var key = audioKeys[i];
        audioClips[key].audio = film.add.audio(key);
        sounds[i] = audioClips[key].audio;
    }
    film.sound.setDecodedCallback(sounds, function(){audioReady = true;}, this);
    
    
    //filters
    filters.blurX = this.add.filter('BlurX');
    filters.blurY = this.add.filter('BlurY');
    
    
    window.onfocus = onResize;
    
    //document.fonts.ready.then(function () {doIntro();});
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

}

function prepareText(item){
    if( item.hasOwnProperty('string') ){
        item.text = film.add.text(200,height-200,item.string,basicTextStyle);
        item.text.setShadow(2,2,'black',3);
        item.text.kill();
    }
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
    
    if(state === states.intro){
        film.add.tween(introGroup).to( {alpha: 0}, fadeTime, "Linear", true );
        setTimeout(function(){
            introGroup.destroy();
        },fadeTime);
        
        state = states.scenes;
        scene = 0;
        var nextScene = scenes[scene];
        prepareText(nextScene);
        fadeInNextScene(nextScene);
        audioClips[nextScene.audio].audio.fadeIn(fadeTime,true);
        onResize();
    }else if (state === states.scenes){
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
    
    
    if(state === states.intro){
        return;
    }else if(state === states.scenes){
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
                audioClips[curScene.audio].audio.fadeOut(fadeTime,true);
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
    prepareText(nextScene);
    fadeInNextScene(nextScene);
    
    //audio
    if(curScene.audio === nextScene.audio){
        return;
    }
    if(curScene.audio !== null){
        audioClips[curScene.audio].audio.fadeOut(fadeTime);
    }
    if(nextScene.audio !== null){
        audioClips[nextScene.audio].audio.fadeIn(fadeTime,true);
    }
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

function doIntro(){
    disableControls(10000);
    state = states.intro;
    
    // show image
    introGroup = film.add.group();
    var textGroup = film.add.group();
    var introImage = film.add.image(width/2,height/2,'intro');
    introImage.anchor.set(0.5,0.5);
    var scalex = width/introImage.width;
    var scaley = height/introImage.height;
    var scale = Math.max(scalex,scaley);
    introImage.scale.set(scale,scale);
    introGroup.add(introImage);
    fadeIn(introImage,fadeTime,film);
    onResize();
    var titleFontSize = 0.07*height;
    var titleTextStyle = {
        font: font, 
        fontSize: titleFontSize,
        fill: "white", 
        wordWrap: false, 
        align: "left" 
    };
    var subtitleTextStyle = {
        font: font, 
        fontSize: 0.05*height,
        fill: "white", 
        wordWrap: true, 
        wordWrapWidth: width*0.33, 
        align: "left" 
    };
    
    // we create a dummy text object to load the font
    // otherwise the title doesn't display correctly
    var dummy = film.add.text(0,0,'abc',titleTextStyle);
    dummy.destroy();
    
    setTimeout(function(){
        showTitle();
    },1500);
    
    var showTitle = function(){
        var title = "The American Pika";
        var subtitle = "Another Piece of the Puzzle";

        var x =0.15*width;
        var y = 0.18*height;
        var titleText = film.add.text(x,y,title,titleTextStyle);
        titleText.setShadow(3,3,'black',3);
        titleText.anchor.set(0,0);
        fadeIn(titleText,750,film);
        setTimeout(function(){
            var comma = film.add.text(x+titleText.width,y,',',titleTextStyle);
            comma.setShadow(3,3,'black',3);
            fadeIn(comma,750,film);            
            var subtitleText = film.add.text(x,y+titleFontSize+10,subtitle,subtitleTextStyle);
            subtitleText.setShadow(3,3,'black',3);
            fadeIn(subtitleText,750,film);
            textGroup.add(titleText);
            textGroup.add(comma);
            textGroup.add(subtitleText);
            setTimeout(function(){
                showLocation();
            },3000);
        },1500);
        
    };
    
    var showLocation = function(){
        if( location_data.success ){
            if(location_data.country === 'United States'){
                var species = 1361;
                var statement = 'There are ' + species + ' listed endangered species in the United States.';
                var region = location_data.region;
                if(region !== null && endangered_by_state.hasOwnProperty(region)){
                    species = endangered_by_state[region].species;
                    var state = endangered_by_state[region].name;
                    statement = 'There are ' + species + ' listed endangered species in your state of ' + state + '.';
                    
                    
                }
                var x = 0.5*width;
                var y = 0.7*height;
                subtitleTextStyle.align = "center";
                var speciesText = film.add.text(x,y,statement,subtitleTextStyle);
                speciesText.anchor.set(0.5,0.5);
                speciesText.setShadow(3,3,'black',3);
                fadeIn(speciesText,750,film);
                textGroup.add(speciesText);
                introGroup.add(textGroup);
            }
        }
        setTimeout(function(){showInstructions();},3000);
    };
    
    var showInstructions = function(){
        
        film.add.tween(textGroup).to( {alpha: 0}, fadeTime, "Linear", true );
        var fontSize = 0.04*height;
        var instTextStyle = {
            font: font, 
            fontSize: fontSize,
            fill: "white", 
            wordWrap: true, 
            wordWrapWidth: width*0.4, 
            align: "left" 
        };
        var instructions = [
            "THIS interactive web documentary reveals the potential consequences of climate change in relation to the American pika. These threats are discussed alongside a conversation about human existence and the anxiety that comes with it. After viewing all videos and reading their corresponding text, the two separate topics will merge, and you, the viewer, will be able to add your personal opinions to make this documentary a personal discussion.",
            "For best viewing experience, please press the full-screen icon in the upper right corner of this page beside the mute button.",
            "Scroll down to begin."
        ];
        var x =0.15*width;
        var y = 0.18*height/3;
        for(var i = 0; i < instructions.length; i++){
            var text = film.add.text(x,y,instructions[i],instTextStyle);
            text.anchor.set(0,0);
            text.setShadow(3,3,'black',3);
            fadeIn(text,750,film);
            introGroup.add(text);
            
            y += text.height + fontSize;
        }

        
        
        
    };
    
    
}