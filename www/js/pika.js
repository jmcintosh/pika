var width = screen.width;
var height = screen.height;

var film = new Phaser.Game(
        width, 
        height, 
        Phaser.AUTO, 
        'pika-film', 
        { preload: preload, create: create, update: update, render: render }
);

var basicTextStyle = { font: "24px Arial", 
    fill: "#000000", 
    wordWrap: true, 
    wordWrapWidth: window.innerWidth/4, 
    align: "left" };


var scenes = [ 
    {'title': 'chrome',
     'url': 'video/chrome.webm',
     'string': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id dolor commodo, laoreet dui in, interdum urna.'
    },
    {'title': 'liquid',
     'url': 'video/liquid2.mp4',
     'string': 'There was a video of a flaming skull among these samples, but I found it tacky so I removed it.'
    },
    {'title': 'wormhole',
     'url': 'video/wormhole.mp4',
     'string': "This video won't loop for some reason. Perhaps we will never know why."
    }
];

var speed = 1; //change speed of video, for testing purposes
var scene = 0; //initial scene

var fullscreenKey;
var blurKey;

function preload() {
    
    film.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    film.scale.pageAlignHorizontally = true;
    film.scale.pageAlignVertically = true;
    film.scale.forceOrientation(true,false);
    //film.scale.setScreenSize( true );

    scenes.forEach(function(item,index,array) {
        film.load.video(item.title,item.url);
    });
    
    film.load.script('filters', 'js/filters.js');

}

function create() {
    
    film.stage.backgroundColor = "#FFFFFF";
    
    // Inputs
    fullscreenKey = film.input.keyboard.addKey(Phaser.Keyboard.F);
    blurKey = film.input.keyboard.addKey(Phaser.Keyboard.B);
    
    // Scenes
    scenes.forEach(function(item,index,array) {
        var video = film.add.video(item.title);
        item.video = video;
        var scalex = width/video.video.videoWidth;
        var scaley = height/video.video.videoHeight;
        var scale = Math.max(scalex,scaley);
        item.image = video.addToWorld(width/2,height/2,0.5,0.5,scale,scale);
        if( item.hasOwnProperty('string') ){
            console.log("adding text\n");
            item.text = film.add.text(200,height-200,item.string,basicTextStyle);
            item.text.anchor.set(0);
            item.text.kill();
        }
        item.image.kill();
    });
    
    //filters
    film.blurX = this.add.filter('BlurX');
    film.blurY = this.add.filter('BlurY');
    
    scenes[scene].video.onPlay.addOnce(start,this);
    scenes[scene].image.revive();
    scenes[scene].text.revive();
    scenes[scene].video.play(true,speed);
    
}

function update() {
    
}

function start() {

    //  This would swap on a mouse click
    film.input.onDown.add(changeSource, this);
    fullscreenKey.onDown.add(goFull,this);
    blurKey.onDown.add(addBlur,this);
}

function changeSource() {
    scenes[scene].video.stop();
    scenes[scene].image.kill();
    scenes[scene].text.kill();
    
    scene++;
    if( scene > scenes.length - 1 ) {
        scene = 0;
    }
    scenes[scene].image.revive();
    scenes[scene].video.play(true,speed);
    
    if( scenes[scene].hasOwnProperty('text') ){
        scenes[scene].text.revive();
    }
}

function goFull() {
    if(film.scale.isFullScreen){
        film.scale.stopFullScreen();
    }else{
        film.scale.startFullScreen(false);
    }
}

function addBlur() {
    scenes[scene].image.filters = [film.blurX, film.blurY];
}

function render() {

    //film.debug.text("Video width: " + scenes[scene].video.video.videoWidth, 600, 32);
    //film.debug.text("Video height: " + scenes[scene].video.video.videoHeight, 600, 64);

    //film.debug.text("Video Time: " + scenes[scene].video.currentTime, 32, 32);
    //film.debug.text("Video Duration: " + scenes[scene].video.duration, 32, 64);

}
