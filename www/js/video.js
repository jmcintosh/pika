/* 
 * various functions related to videos for pika
 */

var filters = {};

var textMarginX = 30;
var textMarginY = 30;

function fadeInVolumeOnVideo(video, time, game, max){
    if(max === undefined) max = 1;
    video.volume = 0;
    game.add.tween(video).to( {volume: max}, time, "Linear", true);
}

function fadeOutVolumeOnVideo(video, time, game){
    game.add.tween(video).to( {volume: 0}, time, "Linear", true); 
}

function fadeIn(image, time, game) {
    image.alpha = 0;
    image.revive();
    game.add.tween(image).to( {alpha: 1}, time, "Linear", true );
}

function fadeOut(image, time, game, callback) {
    game.add.tween(image).to( {alpha: 0}, time, "Linear", true );
    setTimeout(callback,time);
}

function fadeInText(image, time, game) {
    image.anchor.x = 0;
    image.anchor.y = 1;
    console.log(dimension.right);
    console.log(dimension.bottom);
    
    image.x = dimension.left + textMarginX ;
    image.y = dimension.bottom ;
    game.add.tween(image).to({y: dimension.bottom - textMarginY}, time, "Linear", true);
    fadeIn(image, time, game);
}

function fadeOutText(image, time, game, callback) {
    game.add.tween(image).to({y: image.y + textMarginY}, time, "Linear", true);
    fadeOut(image, time, game, callback);
}

function adjustText(image){
    image.x = dimension.left + textMarginX;
    image.y = dimension.bottom - textMarginY;
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

