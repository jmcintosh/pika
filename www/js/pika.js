
var film = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

var scenes = [ 
    {'title': 'chrome',
     'url': 'video/chrome.webm'
    },
    {'title': 'liquid',
     'url': 'video/liquid2.mp4'
    },
    {'title': 'wormhole',
     'url': 'video/wormhole.mp4'
    }
];

function preload() {

    scenes.forEach(function(item,index,array) {
        film.load.video(item.title,item.url);
    });

}

//var video;
//var image;
var speed = 5;
var scene = 0;

function create() {
    
    scenes.forEach(function(item,index,array) {
        var video = film.add.video(item.title);
        //video.onPlay.addOnce(start,this);
        item.video = video;
        item.image = video.addToWorld(400, 300, 0.5, 0.5);  
        item.image.kill();
    });
    scenes[0].video.onPlay.addOnce(start,this);
    scenes[0].image.revive();
    scenes[0].video.play(true,speed);
}

function start() {

    //  This would swap on a mouse click
    film.input.onDown.add(changeSource, this);
}


function changeSource() {
    scenes[scene].video.stop();
    scenes[scene].image.kill();
    
    scene++;
    if( scene > scenes.length - 1 ) {
        scene = 0;
    }
    scenes[scene].image.revive();
    scenes[scene].video.play(true,speed);
    

}

function render() {

    film.debug.text("Video width: " + scenes[scene].video.video.videoWidth, 600, 32);
    film.debug.text("Video height: " + scenes[scene].video.video.videoHeight, 600, 64);

    film.debug.text("Video Time: " + scenes[scene].video.currentTime, 32, 32);
    film.debug.text("Video Duration: " + scenes[scene].video.duration, 32, 64);

}
