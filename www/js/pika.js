"use strict";



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
    { preload: preload, create: create, update: update, render: render },
    true
);


function preload() {   
    film.stage.disableVisibilityChange = true;
    film.stage.backgroundColor = "#FFFFFF";
    film.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    film.scale.pageAlignHorizontally = false;
    film.scale.pageAlignVertically = false;
    film.scale.forceOrientation(true,false);
    
    var textStyleKeys = Object.keys(textStyles);
    for(var i = 0, n = textStyleKeys.length; i< n; i++){
        var key = textStyleKeys[i];
        var textStyle = textStyles[key];
        var dummy = film.add.text(0,0,'abc',textStyle);
        dummy.destroy();
    }
    
    
    film.load.onFileComplete.add(fileComplete, this);
    for(var i = 0; i < scenesBuffer; i++){
        var item = scenes[i];
        film.load.video(item.title,item.url);
    }
    
    var audioKeys = Object.keys(audioClips);
    for(var i = 0, n = audioKeys.length; i < n; i++){
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
    
    
    film.onFocus.add(onResize);
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
    var textStyle = textStyles.basic;
    if(item.textStyle){
        textStyle = item.textStyle;
    }
    if( item.hasOwnProperty('string') ){
        if(Array.isArray(item.string)){
            var textArray = [];
            for(var i = 0, n = item.string.length; i < n; i++){
                var ts = textStyle;
                if(Array.isArray(textStyle)){
                    ts = textStyle[i];
                }
                var text = film.add.text(0,0,item.string[i],ts);
                text.setShadow(2,2,'black',2);
                text.kill();
                textArray[i] = text;
            }
            item.text = textArray;
        }else{
            item.text = film.add.text(0,0,item.string,textStyle);
            item.text.setShadow(2,2,'black',2);
            item.text.kill();
        }
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
        if(Array.isArray(item.text)){
            for(var i = 0, n = item.text.length; i < n; i++){
                item.text[i].destroy();
            }
        }else{
            item.text.destroy();
        }
        delete item.text;
    }
}

function forward() {
    
    if(state === states.intro){
        disableControls(fadeTime);
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
        if( !curScene.hasOwnProperty('text') || curScene.changeScene ){
            disableControls(fadeTime);
            
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
            
            if(curScene.textTransition === 'question'){
                
                curScene.textIndex = 0;
                graphs[graphs.length-1].fadeOut();
            }

            scene++;
            if( scene > scenes.length - 1 ) {
                scene = 0;
            }
        }else{ // show the text
            if( curScene.hasOwnProperty('text') ){
                if(Array.isArray(curScene.text)){
                    switch(curScene.textTransition){
                        case "persist":
                            persist(curScene);
                            break;
                        case "replace":
                            replace(curScene);
                            break;
                        case "question":
                            question(curScene);
                            break;
                        default:
                            standard(curScene);
                    }
                }else{
                    disableControls(fadeTime);
                    fadeInText(curScene.text, fadeTime, film, curScene.textPosition);
                    curScene.changeScene = true;
                    addBlur(curScene.image, fadeTime, film);
                }
            }
        }
    }
    
    // text transition, text remains visible when new text appears
    function persist(curScene){
        disableControls(fadeTime);
        var i = curScene.textIndex;
        if(i === 0){
            addBlur(curScene.image, fadeTime, film);
        }
        fadeInText(curScene.text[i], fadeTime, film, curScene.textPosition[i]);
        if(i >= curScene.text.length-1){
            curScene.changeScene = true;
            curScene.textIndex = 0;
        }else{
            curScene.textIndex++;
        }
    }
    
    // text transition, old text is replaced by new text
    function replace(curScene){
        disableControls(fadeTime);
        var i = curScene.textIndex;
        if(i === 0){
            addBlur(curScene.image, fadeTime, film);
        }else{
            fadeOutText(curScene.text[i-1],fadeTime,film);
        }
        fadeInText(curScene.text[i], fadeTime, film, curScene.textPosition[i]);
        if(i >= curScene.text.length-1){
            curScene.changeScene = true;
            curScene.textIndex = 0;
        }else{
            curScene.textIndex++;
        }
    }
    
    // replacing question divs
    function question(curScene){
        var i = curScene.textIndex;
        if(i === 0){
            disableControls();
            addBlur(curScene.image, fadeTime, film);
        }else{
            // remove old question
            var question = $("#question-"+(i)+"-div");
            fadeOutElement(question,fadeTime);
            fadeOutText(curScene.text[i-1],fadeTime,film);
        }
        
        fadeInText(curScene.text[i], fadeTime, film, curScene.textPosition[i]);
        // add new questions
        if(i < 5){
            var question = $("#question-"+(i+1)+"-div");
            fadeInElement(question,fadeTime);
        }else if(i >= 5 ){
            disableControls();
            var graphIndex = i-5;
            if(graphIndex>=1){
                var oldGraph = graphs[graphIndex-1];
                oldGraph.fadeOut(fadeTime);
            }
            if(graphIndex<graphs.length){
                var newGraph = graphs[graphIndex];
                newGraph.fadeIn(fadeTime,enableControls);
            }
        }
        
        if(i >= curScene.text.length-1){
            curScene.changeScene = true;
        }
        curScene.textIndex++;
        
        

        
    }
    
    // text transition, all text appears at once
    function standard(curScene){
        disableControls(fadeTime);
        addBlur(curScene.image, fadeTime, film);
        for(var i = 0, n = curScene.text.length; i < n; i++){
            fadeInText(curScene.text[i], fadeTime, film, curScene.textPosition[i]);
        }
        curScene.changeScene = true;
    }
}

function back() {
    if(state === states.intro){
        return;
    }else if(state === states.scenes){
        var curScene = scenes[scene];
        if(curScene.changeScene || curScene.textIndex !== 0){
            disableControls(fadeTime);
            if( curScene.hasOwnProperty('text') ){
                curScene.changeScene = false;
                if(Array.isArray(curScene.text)){
                    for(var i = 0, n = curScene.text.length; i < n; i++){
                        var text = curScene.text[i];
                        fadeOutText(text, fadeTime, film, function(){text.kill();});
                    }
                }else{
                    fadeOutText(curScene.text, fadeTime, film, function(){curScene.text.kill();});
                }
                
                if(curScene.textTransition === 'question'){
                    var i = curScene.textIndex;
                    var question = $("#question-"+(i)+"-div");
                    fadeOutElement(question,fadeTime);
                    
                    var graphIndex = i - 6;
                    if(graphIndex >= 0 && graphIndex < 4){
                        graphs[graphIndex].fadeOut();
                    }
                }
                curScene.textIndex = 0;
                removeBlur(curScene.image, fadeTime, film);
            }
        }else{
            console.log("go back");
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
        if(Array.isArray(curScene.text)){
            for(var i = 0, n = curScene.text.length; i < n; i++){
                var text = curScene.text[i];
                fadeOutText(text, fadeTime, film, function(){text.kill();});
            }
        }else{
            fadeOutText(curScene.text, fadeTime, film, function(){curScene.text.kill();});
        }
    }
    fadeOutImage(curScene.image, fadeTime, film, function () {
        curScene.image.kill();
        curScene.video.stop();
        curScene.changeScene = false;
        curScene.textIndex = 0;
        removeBlur(curScene.image, fadeTime, film);
    });
    fadeOutVolumeOnVideo(curScene.video, fadeTime, film);
}

function fadeInNextScene(nextScene){
    fadeInImage(nextScene.image, fadeTime, film);
    fadeInVolumeOnVideo(nextScene.video, fadeTime, film);
    nextScene.video.play(true,speed);
}

function disableControls(time){
    film.input.onDown.removeAll();
    
    keys.up.onDown.removeAll();
    keys.down.onDown.removeAll();
    keys.left.onDown.removeAll();
    keys.right.onDown.removeAll();
    
    $("#question-parent-div").css("visibility","visibile");
    
    film.input.mouse.mouseWheelCallback = null;
    if(time){
        setTimeout(enableControls, time);
    }
}

function enableControls(){
    film.input.onDown.add(forward, this);
    
    keys.up.onDown.add(back, this);
    keys.down.onDown.add(forward, this);
    keys.left.onDown.add(back, this);
    keys.right.onDown.add(forward, this);
    
    
    $("#question-parent-div").css("visibility","hidden");
    
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
    var isFullscreen = false;
    if(document.body.requestFullScreen){
        if(document.fullScreen){
            document.cancelFullScreen();
        }else{
            document.body.requestFullScreen();
            isFullscreen = true;
        }
    }else if(document.body.webkitRequestFullScreen) {
        if(document.webkitIsFullScreen){
            document.webkitCancelFullScreen();
        }else{
            document.body.webkitRequestFullScreen();
            isFullscreen = true;
        }
    }else if(document.body.mozRequestFullScreen) {
        if(document.mozFullScreen){
            document.mozCancelFullScreen();
        }else{
            document.body.mozRequestFullScreen();
            isFullscreen = true;
        }
    }else if(document.body.msRequestFullscreen) {
        if(document.msFullscreenElement){
            document.msExitFullscreen();
        }else{
            document.body.msRequestFullscreen();
            isFullscreen = true;
        }
    }else{
        if(film.scale.isFullScreen){
            film.scale.stopFullScreen();
        }else{
            film.scale.startFullScreen(false);
            isFullscreen = true;
        }
    }
    
    return isFullscreen;
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
    var curScene =scenes[scene];
    if(curScene.text){
        if(Array.isArray(curScene.text)){
            for(var i = 0, n = curScene.text.length; i < n; i++){
                adjustText(curScene.text[i],curScene.textPosition[i]);
            }
        }else{
            adjustText(curScene.text,curScene.textPosition);
        }
    }
}

function toggleAudio() {
    var newState = !($("#background-audio").prop("muted"));
    $("#background-audio").prop("muted",newState);
    film.sound.mute = newState;
    return newState;
};

function update() {
    
}

function render() {

}

function doIntro(){
    disableControls(6000);
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
    onResize();
    fadeInImage(introImage,fadeTime,film);
    
    var titleFontSize = 0.06*height;
    var titleTextStyle = {
        font: font, 
        fontSize: titleFontSize,
        fill: "white", 
        wordWrap: false, 
        align: "left"
    };
    var subtitleTextStyle = {
        font: font, 
        fontSize: 0.04*height,
        fill: "white", 
        wordWrap: true, 
        wordWrapWidth: width*0.35, 
        align: "left"
    };
    
    setTimeout(function(){
        showTitle();
    },1500);
    
    var showTitle = function(){
        var title = "The American Pika";
        var subtitle = "Another Piece of the Puzzle";


        var x =0.15*width;
        var y = 0.18*height;
        var titleText = film.add.text(x,y,title,titleTextStyle);
        titleText.setShadow(3,3,'black',2);
        titleText.anchor.set(0,0);
        fadeInImage(titleText,750,film);
        setTimeout(function(){          
            var subtitleText = film.add.text(x,y+titleFontSize+10,subtitle,subtitleTextStyle);
            subtitleText.setShadow(3,3,'black',2);
            fadeInImage(subtitleText,750,film);
            textGroup.add(titleText);
            textGroup.add(subtitleText);
            setTimeout(function(){
                showLocation();
            },3000);
        },1500);
        
    };
    
    var showLocation = function(){
        var statement = 'There are 7323 listed endangered species world wide.';
        if( location_data.success && location_data.country === 'United States'){
            var region = location_data.region;
            if(region !== null && endangered_by_state.hasOwnProperty(region)){
                var species = endangered_by_state[region].species;
                var state = endangered_by_state[region].name;
                statement = 'There are ' + species + ' listed endangered species in your state of ' + state + '.';
            }
        }
        var x = 0.15*width;
        var y = 0.7*height;
        var speciesText = film.add.text(x,y,statement,subtitleTextStyle);
        speciesText.anchor.set(0,0);
        speciesText.setShadow(3,3,'black',2);
        fadeInImage(speciesText,750,film);
        textGroup.add(speciesText);
        introGroup.add(textGroup);
        setTimeout(function(){showInstructions();},7000);
    };
    
    var showInstructions = function(){
        
        film.add.tween(textGroup).to( {alpha: 0}, fadeTime, "Linear", true );
        var fontSize = 0.035*height;
        var instTextStyle = {
            font: font, 
            fontSize: fontSize,
            fill: "white", 
            wordWrap: true, 
            wordWrapWidth: width*0.4, 
            align: "left"
        };
        var instructions = [
            "This interactive web-based documentary reveals the consequences of climate change in relation to the American pika. The website discusses these threats alongside a conversation about human existence and the anxiety that comes with it. After viewing all videos and text, the two separate topics will merge, and you, the viewer, will be able to add your opinions to make this documentary a personal discussion.",
            "Please press the full-screen icon in the upper right corner of the page and scroll down."
        ];
        var x =0.15*width;
        var y = 0.18*height;
        for(var i = 0; i < instructions.length; i++){
            var text = film.add.text(x,y,instructions[i],instTextStyle);
            text.anchor.set(0,0);
            text.setShadow(3,3,'black',2);
            fadeInImage(text,750,film);
            introGroup.add(text);
            
            y += text.height + fontSize;
        }
        
    };
    
    
}