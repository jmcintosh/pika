

var audioClips = {
    'happybirds': {
        url: 'audio/happybirds.mp3',
        audio: null
    },
    'closeupwater': {
        url: 'audio/closeupwater.mp3',
        audio: null
    },
    'pikaoutdoortone': { 
        url: 'audio/pikaoutdoortone.mp3',
        audio: null
    },
    'raven': {
        url: 'audio/raven.mp3',
        audio: null
    },
    'river': {
        url: 'audio/river.mp3',
        audio: null
    },
    'wind': {
        url: 'audio/wind.mp3',
        audio: null
    }
};




function toggleAudio() {
    var newState = !($("#background-audio").prop("muted"));
    $("#background-audio").prop("muted",newState);
    film.sound.mute = newState;
    return newState;
};