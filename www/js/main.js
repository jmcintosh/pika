/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

$(document).ready(readyFn);

var location_data = {
    'success': false,
    'country': null,
    'region': null
};

function readyFn(){
    getIPGeo();
    
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
    
    //submitAnswer();
}

function submitAnswer(){
    var data = {id: 1, answer: 'yes'};
    var url = 'http://ec2-54-213-82-29.us-west-2.compute.amazonaws.com:5000/question';
    function success(response){
        console.log(response);
    }
    var settings = {
        type: "GET",
        url: url,
        data: data,
        success: success,
        dataType: "json"
    };
    $.ajax(settings);
    
}

function getIPGeo(){
    $.getJSON("http://ip-api.com/json",
        function(json) {
            if(json.status === "success"){
                if('country' in json && 'region' in json){
                    location_data.country = json.country;
                    location_data.region = json.region;
                    location_data.success = true;
                    console.log('location: ' + location_data.country + ' ' + location_data.region);
                    console.log(endangered_by_state[location_data.region].name);
                }
            }else if(json.status === "fail"){
                console.log('unable to get location');
            }
        }
    );
}

var endangered_by_state = {
    'AL':{
        'species': 86,
        'name': 'Alabama'
    },
    'AK':{
        'species': 7,
        'name': 'Alaska'
    },
    'AZ':{
        'species': 44,
        'name': 'Arizona'
    },
    'AR':{
        'species': 25,
        'name': 'Arkansas'
    },
    'CA':{
        'species': 220,
        'name': 'California'
    },
    'CO':{
        'species': 15,
        'name': 'Colorado'
    },
    'CT':{
        'species': 5,
        'name': 'Connecticut'
    },
    'DE':{
        'species': 3,
        'name': 'Delaware'
    },
    'DC':{
        'species': 1,
        'name': 'Washington, DC'
    },
    'FL':{
        'species': 88,
        'name': 'Florida'
    },
    'GA':{
        'species': 46,
        'name': 'Georgia'
    },
    'HI':{
        'species': 421,
        'name': 'Hawaii'
    },
    'ID':{
        'species': 5,
        'name': 'Idaho'
    },
    'IL':{
        'species': 20,
        'name': 'Illinois'
    },
    'IN':{
        'species': 18,
        'name': 'Indiana'
    },
    'IA':{
        'species': 9,
        'name': 'Iowa'
    },
    'KS':{
        'species': 9,
        'name': 'Kansas'
    },
    'KY':{
        'species': 33,
        'name': 'Kentucky'
    },
    'LA':{
        'species': 11,
        'name': 'Louisiana'
    },
    'ME':{
        'species': 5,
        'name': 'Maine'
    },
    'MD':{
        'species': 9,
        'name': 'Maryland'
    },
    'MA':{
        'species': 8,
        'name': 'Massachusetts'
    },
    'MI':{
        'species': 14,
        'name': 'Michigan'
    },
    'MN':{
        'species': 10,
        'name': 'Minnesota'
    },
    'MS':{
        'species': 30,
        'name': 'Mississippi'
    },
    'MO':{
        'species': 24,
        'name': 'Missouri'
    },
    'MT':{
        'species': 5,
        'name': 'Montana'
    },
    'NE':{
        'species': 8,
        'name': 'Nebraska'
    },
    'NV':{
        'species': 23,
        'name': 'Nevada'
    },
    'NH':{
        'species': 6,
        'name': 'New Hampshire'
    },
    'NJ':{
        'species': 6,
        'name': 'New Jersey'
    },
    'NM':{
        'species': 33,
        'name': 'New Mexico'
    },
    'NY':{
        'species': 10,
        'name': 'New York'
    },
    'NC':{
        'species': 42,
        'name': 'North Carolina'
    },
    'ND':{
        'species': 5,
        'name': 'North Dakota'
    },
    'OH':{
        'species': 16,
        'name': 'Ohio'
    },
    'OK':{
        'species': 13,
        'name': 'Oklahoma'
    },
    'OR':{
        'species': 22,
        'name': 'Oregon'
    },
    'PA':{
        'species': 10,
        'name': 'Pennsylvania'
    },
    'RI':{
        'species': 5,
        'name': 'Rhode Island'
    },
    'SC':{
        'species': 25,
        'name': 'South Carolina'
    },
    'SD':{
        'species': 9,
        'name': 'South Dakota'
    },
    'TN':{
        'species': 75,
        'name': 'Tennessee'
    },
    'TX':{
        'species': 78,
        'name': 'Texas'
    },
    'UT':{
        'species': 21,
        'name': 'Utah'
    },
    'VT':{
        'species': 4,
        'name': 'Vermont'
    },
    'VA':{
        'species': 50,
        'name': 'Virginia'
    },
    'WA':{
        'species': 14,
        'name': 'Washington'
    },
    'WV':{
        'species': 13,
        'name': 'West Virginia'
    },
    'WI':{
        'species': 11,
        'name': 'Wisconsin'
    },
    'PR':{
        'species': 58,
        'name': 'Puerto Rico'
    }
};