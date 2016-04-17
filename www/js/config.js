
var width = screen.width;
var height = screen.height;
var scenesBuffer = 4; // the number of videos to buffer, before and after current scene
var keys = {};
var speed = 1; //change speed of video, for testing purposes
var scene = 0; //initial scene
var fadeTime = 500; // time for fades on scene transitions
var states ={
    'intro': 0,
    'instructions': 1,
    'scenes': 2,
    'questions': 3,
    'credits': 4,
    'facts': 5  
};
var state = states.intro;
var introGroup = [];
var audioReady = false;
var dimension = {
    top: 0,
    bottom: height,
    right: width,
    left: 0
};

var font = "Roboto";



var textStyles = {
    basic: 
        { 
            font: font, 
            fontSize: 0.03*height,
            fill: "white", 
            wordWrap: true, 
            wordWrapWidth: width*0.45, 
            align: "left"
        },
    centered_basic: 
        { 
            font: font, 
            fontSize: 0.03*height,
            fill: "white", 
            wordWrap: true, 
            wordWrapWidth: width*0.45, 
            align: "center"
        },
    sunrise: 
        { 
            font: "Waiting for the Sunrise", 
            fontSize: 0.03*height,
            fill: "white", 
            wordWrap: true, 
            wordWrapWidth: width*0.45, 
            align: "left"
        }
};

var scenes = [
    {
        "string": "According to the fossil record, American pikas have existed for 500,000 years.",
        "textIsShown": false,
        "title": "01 PikaEatsLichenSM ",
        "url": "video/PikaEatsLichenSM.mp4",
        "textPosition": 1,
        "audio": "ambiancealittlerustleraven"
    },
    {
        "string": "An increase in greenhouse gases has caused global surface temperatures to rise over the last 100 years.",
        "textIsShown": false,
        "title": "02 IceIceBaby",
        "url": "video/IceIceBaby.mp4",
        "textPosition": 9,
        "audio": "closeupwater"
    },
    {
        "string": "American pikas usually inhabit mountainous areas 2,500 meters above sea level in western North America. They prefer their temperatures cool, their environment moist, and their land to be covered with broken rocks. ",
        "textIsShown": false,
        "title": "03 FallColorPikaHabitat2",
        "url": "video/FallColorPikaHabitat2.mp4",
        "textPosition": 1,
        "audio": "happybirds"
    },
    {
        "string": "Raising awareness of the causes and consequences of global climate change can alter individual behaviors, but most people quickly respond with avoidance and denial.",
        "textIsShown": false,
        "title": "04 GallitanGateway",
        "url": "video/GallitanGateway.mp4",
        "textPosition": 9,
        "audio": "river2"
    },
    {
        "string": "This small mammal resembles its rabbit relatives. Its round, furry body appears cinnamon brown in the summer, but in winter, its fur lengthens and contains more gray hues.",
        "textIsShown": false,
        "title": "05 PikaEatsLeafRichColor",
        "url": "video/PikaEatsLeafRichColor.mp4",
        "textPosition": 7,
        "audio": "pikasandambiancebirds"
    },
    {
        "string": "The most negative projection for a species impacted by climate change is death and extinction. As conscious beings, the thought of our own mortality or the extinction of our species causes us anxiety.",
        "textIsShown": false,
        "title": "06 TreeNHeat",
        "url": "video/TreeNHeat.mp4",
        "textPosition": 6,
        "audio": null
    },
    {
        "string": "Pikas have a high resting body temperature suited for their cool, mountainous habitat. Air temperatures above even 78°F are lethal, causing pikas to overheat.",
        "textIsShown": false,
        "title": "05 PikaEatsYellowFlowers2",
        "url": "video/PikaEatsYellowFlowers2.mp4",
        "textPosition": 7,
        "audio": "pikasandambiancebirds"
    },
    {
        "string": "According to the Terror Management Theory, we use self-esteem to reduce the stress caused by the inevitability of death.",
        "textIsShown": false,
        "title": "08 EnnisLake",
        "url": "video/EnnisLake.mp4",
        "textPosition": 3,
        "audio": null
    },
    {
        "string": "Since temperatures beneath the rocks remain comfortable for pikas year-round, they use the rocks as structure for their dens and refuge from heat, predators, and snow.",
        "textIsShown": false,
        "title": "09 PikaDen",
        "url": "video/PikaDen.mp4",
        "textPosition": 4,
        "audio": "pikasandambiancebirds"
    },
    {
        "string": "Some cultures value belief in the supernatural, while others appreciate respect for heroism, materialism, nationalism, or artistry. When we perform well according to our cultural worldviews, we feel positively about ourselves. This positive feeling gives us the self-esteem we need to ease our stress about death.",
        "textIsShown": false,
        "title": "10 SnowGlitter",
        "url": "video/SnowGlitter.mp4",
        "textPosition": 3,
        "audio": null
    },
    {
        "string": "To have available food during winter, pikas store edible vegetation within their dens in the summer, a process called haying. They forage for grasses, flowers, mosses, and lichens.",
        "textIsShown": false,
        "title": "11 PikaHaysYellowFlowers2",
        "url": "video/PikaHaysYellowFlowers2.mp4",
        "textPosition": 1,
        "audio": "clipforpikaeating"
    },
    {
        "string": "Since we gain self-esteem by achieving to our cultural standards, we will defend our cultural worldview in order to protect our level of self-esteem.",
        "textIsShown": false,
        "title": "12 Pallisade",
        "url": "video/Pallisade.mp4",
        "textPosition": 6,
        "audio": null
    },
    {
        "string": "Pikas remain alert when they hay, vocalizing at every sign of potential predators. Weasels, their most successful predator, slip through the broken rocks to enter pikas’ dens. If pikas avoid predation, they can live up to 7 years.",
        "textIsShown": false,
        "title": "13 Weasel",
        "url": "video/Weasel.mp4",
        "textPosition": 7,
        "audio": "pikasandambiancebirds"
    },
    {
        "string": "As we age, we grow to dislike others with opposing worldviews to our own.",
        "textIsShown": false,
        "title": "14 GallatinRiver",
        "url": "video/GallatinRiver.mp4",
        "textPosition": 9,
        "audio": "river2"
    },
    {
        "string": "These cautious animals currently seem abundant within their range, but wildlife biologists have petitioned the Fish and Wildlife Service twice to list the species as endangered with climate change as their primary threat.",
        "textIsShown": false,
        "title": "15 Tallus",
        "url": "video/Tallus.mp4",
        "textPosition": 1,
        "audio": "ravennew"
    },
    {
        "string": ["What if a person’s cultural worldview included the importance of conservation and carbon neutrality?", "What if this was an avenue for self-esteem?", "What if people saw sustainable nature as an immortality project?"],
        "textIsShown": false,
        "title": "16 GraaWind",
        "url": "video/GraaWind.mp4",
        "textPosition": [10, 5, 11],
        "textStyle": [textStyles.basic,textStyles.basic,textStyles.basic],
        "textTransition": "persist",
        "textIndex": 0,
        "audio": "grassblows"
    },
    {
        "string": ["Climate change models predict temperatures within the American pika’s current range to increase to life-threatening levels over the next 100 years.", "Since pikas already reside at the tops of mountains, there is no place cooler they can go."],
        "textIsShown": false,
        "title": "17 FallColorPikaHabitat ",
        "url": "video/FallColorPikaHabitat.mp4",
        "textPosition": [5,5],
        "textStyle": [textStyles.basic,textStyles.basic],
        "textTransition": "replace",
        "textIndex": 0,
        "audio": "happybirds"
    },
    {
        "string": '"Only within the moment of time represented by the present century has one species - man - acquired significant power to alter the nature of the world."\n                                        Rachel Carson',
        "textIsShown": false,
        "title": "18 SunsetHyalite",
        "url": "video/SunsetHyalite.mp4",
        "textPosition": 5,
        "textStyle": textStyles.sunrise,
        "audio": null
    },
    {
        "string": "Do you think global climate change is occurring? Do you think humans contribute to global climate change? Do you think individuals can make a positive difference concerning global climate change? What are some ways you have behaviorally responded to global climate change awareness? Recycling, Carpooling, Composting, Biking/Walking in place of driving, Vegetarianism, Other, No Behavioral Response.",
        "textIsShown": false,
        "title": "19 BigTruckInSnow",
        "url": "video/BigTruckInSnow.mp4",
        "textPosition": 1,
        "audio": null
    },
    {
        "string": ["Created By\nCatherine Mullen", "Code By\nJohn McIntosh", "Produced as part of the MFA program in Science and Natural History Filmmaking\nMontana State University Bozeman\nsfp.montana.edu/sciencenaturefilm"],
        "textIsShown": false,
        "title": "20 PikaPurpleFlower",
        "url": "video/PikaPurpleFlower.mp4",
        "textPosition": [12, 13, 8],
        "textStyle": [textStyles.basic,textStyles.basic,textStyles.centered_basic],
        "audio": null
    },
    {
        "title": "21 WoodSnow",
        "url": "video/WoodSnow.mp4",
        "textPosition": 7,
        "textIndex": 0,
        "audio": null
    }
];
