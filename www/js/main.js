/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

$(document).ready(readyFn);

function readyFn(){
    $("#mute-button").click(function(){
        var muted = toggleBackgroundAudio();
        if(muted){
            $("#mute-button-icon").removeClass("glyphicon-volume-up");
            $("#mute-button-icon").addClass("glyphicon-volume-off");
        }else{
            $("#mute-button-icon").removeClass("glyphicon-volume-off");
            $("#mute-button-icon").addClass("glyphicon-volume-up");
        }
    });
    
    $("#fullscreen-button").click(function(){
        toggleFullScreen();
    });
}