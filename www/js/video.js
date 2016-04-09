/* 
 * various functions related to videos for pika
 */

var filters = {};

var textMarginX = 30;
var textMarginY = 30;

var POSITION = {
    "top_left": 1,
    "top_center": 2,
    "top_right": 3,
    "mid_left": 4,
    "mid_center": 5,
    "mid_right": 6,
    "bot_left": 7,
    "bot_center": 8,
    "bot_right": 9
};

function fadeInVolumeOnVideo(video, time, game, max){
    if(max === undefined) max = 1;
    video.volume = 0;
    game.add.tween(video).to( {volume: max}, time, "Linear", true);
}

function fadeOutVolumeOnVideo(video, time, game){
    game.add.tween(video).to( {volume: 0}, time, "Linear", true); 
}

function fadeInImage(image, time, game) {
    image.alpha = 0;
    image.revive();
    game.add.tween(image).to( {alpha: 1}, time, "Linear", true );
}

function fadeOutImage(image, time, game, callback) {
    game.add.tween(image).to( {alpha: 0}, time, "Linear", true );
    if(callback !== undefined){
        setTimeout(callback,time);
    }
}

function fadeInText(image, time, game, position) {
    if(position === undefined){position = POSITION.bot_left;}
    
    switch(position){
        case POSITION.top_left:
            image.anchor.x = 0;
            image.anchor.y = 0;
            image.x = dimension.left + textMarginX;
            image.y = dimension.top + 2*textMarginY;
            break;
        case POSITION.top_center:
            image.anchor.x = 0.5;
            image.anchor.y = 0;
            image.x = (dimension.left + dimension.right)/2;
            image.y = dimension.top + 2*textMarginY;
            break;
        case POSITION.top_right:
            image.anchor.x = 1;
            image.anchor.y = 0;
            image.x = dimension.right - textMarginX ;
            image.y = dimension.top + 2*textMarginY;
            break;
        case POSITION.mid_left:
            image.anchor.x = 0;
            image.anchor.y = 0.5;
            image.x = dimension.left + textMarginX;
            image.y = (dimension.top+dimension.bottom)/2 + textMarginY;
            break;
        case POSITION.mid_center:
            image.anchor.x = 0.5;
            image.anchor.y = 0.5;
            image.x = (dimension.left + dimension.right)/2;
            image.y = (dimension.top+dimension.bottom)/2 + textMarginY;
            break;
        case POSITION.mid_right:
            image.anchor.x = 1;
            image.anchor.y = 0.5;
            image.x = dimension.right - textMarginX ;
            image.y = (dimension.top+dimension.bottom)/2 + textMarginY;
            break;
        case POSITION.bot_left:
            image.anchor.x = 0;
            image.anchor.y = 1;
            image.x = dimension.left + textMarginX ;
            image.y = dimension.bottom;
            break;
        case POSITION.bot_center:
            image.anchor.x = 0.5;
            image.anchor.y = 1;
            image.x = (dimension.left + dimension.right)/2;
            image.y = dimension.bottom;
            break;
        case POSITION.bot_right:
            image.anchor.x = 1;
            image.anchor.y = 1;
            image.x = dimension.right - textMarginX ;
            image.y = dimension.bottom;
            break;
        default:
            console.log("default position");
            image.anchor.x = 0;
            image.anchor.y = 1;
            image.x = dimension.left + textMarginX ;
            image.y = dimension.bottom;
            break;
    }
    game.add.tween(image).to({y: image.y - textMarginY}, time, "Linear", true);
    fadeInImage(image, time, game);
}

function fadeOutText(image, time, game, callback) {
    game.add.tween(image).to({y: image.y + textMarginY}, time, "Linear", true);
    fadeOutImage(image, time, game, callback);
}

function adjustText(image,position){
    
    switch(position){
        case POSITION.top_left:
            image.x = dimension.left + textMarginX;
            image.y = dimension.top + textMarginY;
            break;
        case POSITION.top_center:
            image.x = (dimension.left + dimension.right)/2;
            image.y = dimension.top + textMarginY;
            break;
        case POSITION.top_right:
            image.x = dimension.right - textMarginX ;
            image.y = dimension.top + textMarginY;
            break;
        case POSITION.mid_left:
            image.x = dimension.left + textMarginX;
            image.y = (dimension.top+dimension.bottom)/2;
            break;
        case POSITION.mid_center:
            image.x = (dimension.left + dimension.right)/2;
            image.y = (dimension.top+dimension.bottom)/2;
            break;
        case POSITION.mid_right:
            image.x = dimension.right - textMarginX ;
            image.y = (dimension.top+dimension.bottom)/2;
            break;
        case POSITION.bot_left:
            image.x = dimension.left + textMarginX ;
            image.y = dimension.bottom - textMarginY;
            break;
        case POSITION.bot_center:
            image.x = (dimension.left + dimension.right)/2;
            image.y = dimension.bottom - textMarginY;
            break;
        case POSITION.bot_right:
            image.x = dimension.right - textMarginX ;
            image.y = dimension.bottom - textMarginY;
            break;
        default:
            console.log("default position");
            image.x = dimension.left + textMarginX ;
            image.y = dimension.bottom - textMarginY;
            break;
    }
}

function addBlur(image, time, game) {
    filters.blurX.uniforms.blur.value  = 0;
    filters.blurY.uniforms.blur.value  = 0;
    image.filters = [filters.blurX, filters.blurY];
    game.add.tween(filters.blurX.uniforms.blur).to({value: 1/512},time,"Linear",true);
    game.add.tween(filters.blurY.uniforms.blur).to({value: 1/512},time,"Linear",true);
}

function removeBlur(image, time, game) {
    game.add.tween(filters.blurX.uniforms.blur).to({value: 0},time,"Linear",true);
    game.add.tween(filters.blurY.uniforms.blur).to({value: 0},time,"Linear",true);
    
    setTimeout(function(){image.filters = null;},time);
}

