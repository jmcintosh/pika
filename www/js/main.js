/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//"use strict";

$(document).ready(readyFn);

var api_url = "http://ec2-54-213-82-29.us-west-2.compute.amazonaws.com:5000";

var location_data = {
    'success': false,
    'country': null,
    'region': null
};

function readyFn(){
    getIPGeo();
    
    $("#mute-button").click(function(){
        var muted = toggleAudio();
        if(muted){
            $("#mute-button-icon").removeClass("glyphicon-volume-up");
            $("#mute-button-icon").addClass("glyphicon-volume-off");
        }else{
            $("#mute-button-icon").removeClass("glyphicon-volume-off");
            $("#mute-button-icon").addClass("glyphicon-volume-up");
        }
    });
    
    $("#fullscreen-button").click(function(){
        var isFullscreen = toggleFullScreen();
        if(isFullscreen){
            $("#fullscreen-button-icon").removeClass("glyphicon-resize-full");
            $("#fullscreen-button-icon").addClass("glyphicon-resize-small");
        }else{
            $("#fullscreen-button-icon").removeClass("glyphicon-resize-small");
            $("#fullscreen-button-icon").addClass("glyphicon-resize-full");
        }
    });
    
    $("#home-button").click(function(){
        window.location.reload();
    });
    
    // question 1
    $("#question-1-yes").click(function(){
        submitAnswer(1,'yes');
        forward();
    });
    
    $("#question-1-no").click(function(){
        submitAnswer(1,'no');
        forward();
    });
    
    // question 2
    $("#question-2-yes").click(function(){
        submitAnswer(2,'yes');
        forward();
    });
    
    $("#question-2-no").click(function(){
        submitAnswer(2,'no');
        forward();
    });
    
    // question 3
    $("#question-3-yes").click(function(){
        submitAnswer(3,'yes');
        forward();
    });
    
    $("#question-3-no").click(function(){
        submitAnswer(3,'no');
        forward();
    });
    
    //question 4
    for(var i = 1; i < 6; i++){
        var id = "#question-4-" + i;
        $(id).click(function(event){
            var id = event.currentTarget;
            var cb = $(id).find(".glyphicon");
            var isChecked = cb.hasClass("glyphicon-check");
            if(isChecked){
                cb.removeClass("glyphicon-check");
                cb.addClass("glyphicon-unchecked");
            }else{
                cb.removeClass("glyphicon-unchecked");
                cb.addClass("glyphicon-check");
                // remove checkbox from "no-behavioral-response
                $("#question-4-6-checkbox").removeClass("glyphicon-check");
                $("#question-4-6-checkbox").addClass("glyphicon-unchecked");
            }
        });
    }
    
    $("#question-4-6").click(function(event){
        var cb = $("#question-4-6-checkbox");
        var isChecked = cb.hasClass("glyphicon-check");
        if(isChecked){
            cb.removeClass("glyphicon-check");
            cb.addClass("glyphicon-unchecked");
        }else{
            cb.removeClass("glyphicon-unchecked");
            cb.addClass("glyphicon-check");
            // remove checkbox from all other answers
            for(var i = 1; i<6; i++){
                $("#question-4-"+i+"-checkbox").removeClass("glyphicon-check");
                $("#question-4-"+i+"-checkbox").addClass("glyphicon-unchecked");
            }
        }
    });
    
    $("#question-4-submit").click(function(){
        //TODO: add logic to get checked boxes and submit answer
        var data = {
            id: 4,
            recycling: 0,
            carpooling: 0,
            biking_walking: 0,
            vegetarian: 0,
            other: 0,
            no_response: 0
        };
        
        if($("#question-4-1-checkbox").hasClass("glyphicon-check")){
            data.recycling = 1;
        }
        if($("#question-4-2-checkbox").hasClass("glyphicon-check")){
            data.carpooling = 1;
        }
        if($("#question-4-3-checkbox").hasClass("glyphicon-check")){
            data.biking_walking = 1;
        }
        if($("#question-4-4-checkbox").hasClass("glyphicon-check")){
            data.vegeterian = 1;
        }
        if($("#question-4-5-checkbox").hasClass("glyphicon-check")){
            data.other = 1;
        }
        if($("#question-4-6-checkbox").hasClass("glyphicon-check")){
            data.no_response = 1;
        }
        
        function success(response){
            console.log(response);
        }
        var settings = {
            type: "GET",
            url: api_url + "/question",
            data: data,
            success: success,
            dataType: "json"
        };
        $.ajax(settings);
        
        forward();
    });
    
    $("#comment-submit").click(function(){
        //TODO: add logic to submit comment
        
        var data = {};
        
        data.name = $('#comment-name').val();
        data.content = $('#comment-content').val();
        
        function success(response){
            processComments(response);
        }
        var settings = {
            type: "GET",
            url: api_url + "/comment",
            data: data,
            success: success,
            dataType: "json"
        };
        $.ajax(settings);
        
        forward();
    });
    
    $("#comment-no-thanks").click(function(){
        function success(response){
            processComments(response);
        }
        var settings = {
            type: "GET",
            url: api_url + "/comments",
            success: success,
            dataType: "json"
        };
        $.ajax(settings);
        forward();
    });
    
    
    $('#background-audio').prop('volume',1.0);
}

function submitAnswer(question_id,answer){
    var data = {id: question_id, answer: answer};
    function success(response){
        console.log(response);
    }
    var settings = {
        type: "GET",
        url: api_url + "/question",
        data: data,
        success: success,
        dataType: "json"
    };
    $.ajax(settings);
    
}

function processComments(response){
    
    var finalScene = scenes[scenes.length-1];
    finalScene.string = [];
    finalScene.textPosition = [];
    finalScene.textTransition = "replace";
    finalScene.textIndex = 0;
    
    for(var i = 0; i < 9; i++){
        if(response[i]){
            var name = response[i].name;
            var content = response[i].content;
            finalScene.string[i] = name + " said:\n" + content;
            finalScene.textPosition[i] = Math.floor(Math.random()*9)+1;
        }
    }
    
}


function getIPGeo(){
    $.getJSON("http://ip-api.com/json",
        function(json) {
            if(json.status === "success"){
                if('country' in json && 'region' in json){
                    location_data.country = json.country;
                    location_data.region = json.region;
                    location_data.success = true;
                }
            }else if(json.status === "fail"){
                console.log('unable to get location');
            }
        }
    );
}

