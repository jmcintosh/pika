var film = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, render: render });

var basicTextStyle = { font: "18px Arial", 
    fill: "black", 
    wordWrap: true, 
    wordWrapWidth: window.innerWidth/5, 
    align: "center" };

var scenes = [ 
    {'title': 'chrome',
     'url': 'video/chrome.webm',
     'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id dolor commodo, laoreet dui in, interdum urna.'
    },
    {'title': 'liquid',
     'url': 'video/liquid2.mp4',
     'text': 'There use to be a video of a flaming skull, but I found it tacky so I removed it.'
    },
    {'title': 'wormhole',
     'url': 'video/wormhole.mp4',
     'text': "This video won't loop for some reason. Perhaps we will never know why."
    }
];

var speed = 1; //change speed of video, for testing purposes
var scene = 0; //initial scene

function preload() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.forceOrientation(true,false);
    //film.scale.setScreenSize( true );

    scenes.forEach(function(item,index,array) {
        film.load.video(item.title,item.url);
    });

}

function create() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    
    scenes.forEach(function(item,index,array) {
        var video = film.add.video(item.title);
        item.video = video;
        var scalex = width/video.video.videoWidth;
        var scaley = height/video.video.videoHeight;
        var scale = Math.min(scalex,scaley);
        item.image = video.addToWorld(width/2,height/2,0.5,0.5,scale,scale);
        if( item.hasOwnProperty('text') ){
            console.log("adding text\n");
            text = film.add.text(-100,50, item.text, basicTextStyle);
            text.anchor.set(0.5);
            item.image.addChild(text);
        }
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

    //film.debug.text("Video width: " + scenes[scene].video.video.videoWidth, 600, 32);
    //film.debug.text("Video height: " + scenes[scene].video.video.videoHeight, 600, 64);

    //film.debug.text("Video Time: " + scenes[scene].video.currentTime, 32, 32);
    //film.debug.text("Video Duration: " + scenes[scene].video.duration, 32, 64);

}
