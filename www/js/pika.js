
var film = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

var scenes = [
    {'title': 'liquid',
     'url': 'video/liquid2.mp4'
    }, 
    {'title': 'skull',
     'url': 'video/skull.mp4'
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

var video;
var sprite;
var scene = 0;

function create() {

    video = film.add.video(scenes[scene].title);

    video.onPlay.addOnce(start, this);

    sprite = video.addToWorld(400, 300, 0.5, 0.5);

    video.play(true);

}

function start() {

    //  This would swap on a mouse click
    film.input.onDown.add(changeSource, this);
}


function changeSource() {
    
    scene++;
    if( scene > scenes.length - 1 ) {
        scene = 0;
    }
    video.changeSource(scenes[scene].url);

}

function render() {

    film.debug.text("Video width: " + video.video.videoWidth, 600, 32);
    film.debug.text("Video height: " + video.video.videoHeight, 600, 64);

    film.debug.text("Video Time: " + video.currentTime, 32, 32);
    film.debug.text("Video Duration: " + video.duration, 32, 64);

}
