"use strict";
var width = screen.width;
var height = screen.height;
// the number of videos to buffer, before and after current scene
var scenesBuffer = 3; 
var keys = {};
var audio = {};

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
    
//    {'title': 'iceinwater',
//     'url': 'video/IceInWater.mp4',
//     'string': 'IceInWater.mp4',
//     'textIsShown': false
//    },
    {'title': 'treeinheat',
     'url': 'video/TreeInHeat.mp4',
     'string': 'TreeInHeat.mp4',
     'textIsShown': false
    },
//    {'title': 'grasses',
//     'url': 'video/Grasses.mp4',
//     'string': 'Grasses.mp4',
//     'textIsShown': false
//    },
//    {'title': 'Weasel',
//     'url': 'video/Weasel.mp4',
//     'string': 'Weasel.mp4',
//     'textIsShown': false
//    },
//    {'title': 'pikaeatslichensm',
//     'url': 'video/PikaEatsLichenSM.mp4',
//     'string': 'PikaEatsLichenSM.mp4',
//     'textIsShown': false
//    },
//    {'title': 'pikaeatsgrass',
//     'url': 'video/PikaEatsGrass.mp4',
//     'string': 'PikaEatsGrass.mp4',
//     'textIsShown': false
//    },
//    {'title': 'pikaeatsyellowflower3',
//     'url': 'video/PikaEatsYellowFlower3.mp4',
//     'string': 'PikaEatsYellowFlower3.mp4',
//     'textIsShown': false
//    },
//    {'title': 'pikaeatsyellowflower2',
//     'url': 'video/PikaEatsYellowFlower2.mp4',
//     'string': 'PikaEatsYellowFlower2.mp4',
//     'textIsShown': false
//    },
//    {'title': 'pikahaysyellowflower',
//     'url': 'video/PikaHaysYellowFlower.mp4',
//     'string': 'PikaHaysYellowFlower.mp4',
//     'textIsShown': false
//    },
//    {'title': 'pikaeatsyellowflower',
//     'url': 'video/PikaEatsYellowFlower.mp4',
//     'string': 'PikaEatsYellowFlower.mp4',
//     'textIsShown': false
//    },
    {'title': 'tallus',
     'url': 'video/Tallus.mp4',
     'string': 'Tallus.mp4',
     'textIsShown': false
    },
//    {'title': 'talluswden',
//     'url': 'video/TallusWDen.mp4',
//     'string': 'TallusWDen.mp4',
//     'textIsShown': false
//    },
    {'title': 'fallcolorpikahabitat',
     'url': 'video/FallColorPikaHabitat.mp4',
     'string': 'FallColorPikaHabitat.mp4',
     'textIsShown': false
    },
    {'title': 'pikaden',
     'url': 'video/PikaDen.mp4',
     'string': 'PikaDen.mp4',
     'textIsShown': false
    },
//    {'title': 'wspikahabitat',
//     'url': 'video/WSPikaHabitat.mp4',
//     'string': 'WSPikaHabitat.mp4',
//     'textIsShown': false
//    },
    {'title': 'pikaeatsyellowflowers2',
     'url': 'video/PikaEatsYellowFlowers2.mp4',
     'string': 'PikaEatsYellowFlowers2.mp4',
     'textIsShown': false
    },
//    {'title': 'grassblowingwind',
//     'url': 'video/GrassBlowingWind.mp4',
//     'string': 'GrassBlowingWind.mp4',
//     'textIsShown': false
//    },
    {'title': 'pikahaypurpleflower',
     'url': 'video/PikaHayPurpleFlower.mp4',
     'string': 'PikaHayPurpleFlower.mp4',
     'textIsShown': false
    },
    
    
    
//    {'title': 'bigtruckinsnow',
//     'url': 'video/BigTruckInSnow.mp4',
//     'string': 'BigTruckInSnow.mp4',
//     'textIsShown': false
//    },
//    {'title': 'ennislake',
//     'url': 'video/EnnisLake.mp4',
//     'string': 'EnnisLake.mp4',
//     'textIsShown': false
//    },
//    {'title': 'madisonriver',
//     'url': 'video/MadisonRiver.mp4',
//     'string': "MadisonRiver.mp4",
//     'textIsShown': false
//    },
//    {'title': 'pallisadefalls',
//     'url': 'video/PallisadeFalls.mp4',
//     'string': 'PallisadeFalls.mp4',
//     'textIsShown': false
//    },
//    {'title': 'snowglitter',
//     'url': 'video/SnowGlitter.mp4',
//     'string': 'SnowGlitter.mp4',
//     'textIsShown': false
//    },
    {'title': 'sunsethyalite',
     'url': 'video/SunsetHyalite.mp4',
     'string': 'SunsetHyalite.mp4',
     'textIsShown': false
    }
//    {'title': 'woodlandsnowycreek',
//     'url': 'video/WoodlandSnowyCreek.mp4',
//     'string': 'WoodlandSnowyCreek.mp4',
//     'textIsShown': false
//    }
];

var speed = 1; //change speed of video, for testing purposes
var scene = 0; //initial scene
var fadeTime = 500; // time for fades on scene transitions


function preload() {
    film.stage.disableVisibilityChange = true;
    film.stage.backgroundColor = "#FFFFFF";
    film.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

    film.scale.pageAlignHorizontally = false;
    film.scale.pageAlignVertically = false;
    film.scale.forceOrientation(true,false);
    
    film.load.audio('background', 'audio/placeholder.mp3');
    
//    for(var i = 0; i <= scenesBuffer; i++){
//        var scene = scenes[i];
//        film.load.video(scene.title,scene.url);
//    }
    
    scenes.forEach(function(item,index,array) {
        film.load.video(item.title,item.url);
    });
    
    film.load.script('filters', 'js/filters.js');
    
    
    // keep it centered
    window.onresize = function(event){
        var x = (film.scale.width - window.innerWidth)/2;
        var y = (film.scale.height - window.innerHeight)/2;
        window.scrollTo(x,y);
    };

}

function create() {
    // Inputs
    keys.up = film.input.keyboard.addKey(Phaser.Keyboard.UP);
    keys.down = film.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    keys.left = film.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    keys.right = film.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    
    // Scenes
//    for(var i = 0; i <= scenesBuffer; i++){
//        var scene = scenes[i];
//        var video = film.add.video(scene.title);
//        scene.video = video;
//        var scalex = width/video.video.videoWidth;
//        var scaley = height/video.video.videoHeight;
//        var scale = Math.max(scalex,scaley);
//        scene.image = video.addToWorld(width/2,height/2,0.5,0.5,scale,scale);
//        scene.image.kill();
//    }
    
    scenes.forEach(function(item,index,array) {
        var video = film.add.video(item.title);
        item.video = video;
        var scalex = width/video.video.videoWidth;
        var scaley = height/video.video.videoHeight;
        var scale = Math.max(scalex,scaley);
        item.image = video.addToWorld(width/2,height/2,0.5,0.5,scale,scale);
        if( item.hasOwnProperty('string') ){
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

function start() {

    //  hot keys
    enableControls();
    
//    var piechart = new PieChart(film,width/2, height/2, height/4, 50,50 );
//    piechart.draw();
}

function startAudio() {
    audio.background.loopFull(0.5);
}

function toggleBackgroundAudio() {
    var newState = !audio.background.mute;
    audio.background.mute = newState;
    return newState;
};


function nextScene() {
    disableControls(fadeTime);
    if(scenes[scene].textIsShown){
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

function prevScene() {
    disableControls(fadeTime);
    var curScene = scenes[scene];
    if(scenes[scene].textIsShown){
        if( scenes[scene].hasOwnProperty('text') ){
            curScene.textIsShown = false;
            fadeOutText(curScene.text, fadeTime, film, function(){curScene.text.kill();});
            removeBlur(curScene.image, fadeTime, film);
        }
    }else{
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
    film.input.onDown.add(nextScene, this);
    
    keys.up.onDown.add(prevScene, this);
    keys.down.onDown.add(nextScene, this);
    keys.left.onDown.add(prevScene, this);
    keys.right.onDown.add(nextScene, this);
    
    enableMousewheel();
}

function enableMousewheel(){
    film.input.mouse.mouseWheelCallback = function(event) {
        if( film.input.mouse.wheelDelta === Phaser.Mouse.WHEEL_UP ){
            prevScene();
        }else if( film.input.mouse.wheelDelta === Phaser.Mouse.WHEEL_DOWN ){
            nextScene();
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
