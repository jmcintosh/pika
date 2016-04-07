

var audioClips = {
    'ambiancealittlerustleraven': {
        url: 'audio/ambiancealittlerustleraven.mp3',
        audio: null
    },
    'birdsforpika': {
        url: 'audio/birdsforpika.mp3',
        audio: null
    },
    'clipforpikaeating': {
        url: 'audio/clipforpikaeating.mp3',
        audio: null
    },
    'closeupwater': {
        url: 'audio/closeupwater.mp3',
        audio: null
    },
    'grassblows': {
        url: 'audio/grassblows.mp3',
        audio: null
    },
    'happybirds': {
        url: 'audio/happybirds.mp3',
        audio: null
    },
    'pikasandambiancebirds': { 
        url: 'audio/pikasandambiancebirds.mp3',
        audio: null
    },
    'ravennew': {
        url: 'audio/ravennew.mp3',
        audio: null
    },
    'river2': {
        url: 'audio/river2.mp3',
        audio: null
    },
    'whitenoiseish': {
        url: 'audio/whitenoiseish.mp3',
        audio: null
    },
    'wind2': {
        url: 'audio/wind2.mp3',
        audio: null
    }
};




function toggleAudio() {
    var newState = !($("#background-audio").prop("muted"));
    $("#background-audio").prop("muted",newState);
    film.sound.mute = newState;
    return newState;
};