
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

var filters = {};

var graphs = [];

var textMarginX = 0.04*height;
var textMarginY = 0.04*height;

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
    basic_italic: 
        { 
            font: font, 
            fontStyle: "italic",
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
            fontSize: 0.035*height,
            fill: "white", 
            wordWrap: true, 
            wordWrapWidth: width*0.45, 
            align: "left"
        }
};

var scenes = [
    {
        "string": "According to the fossil record, American pikas have existed for 500,000 years.",
        "title": "01 PikaEatsLichenSM ",
        "url": "video/PikaEatsLichenSM.mp4",
        "textPosition": 4,
        "audio": "clipforpikaeating"
    },
    {
        "string": "An increase in greenhouse gases has caused global surface temperatures to rise over the last 100 years.",
        "title": "02 IceIceBaby",
        "url": "video/IceIceBaby.mp4",
        "textPosition": 3,
        "textStyle": textStyles.basic_italic,
        "audio": "river2"
    },
    {
        "string": "American pikas usually inhabit mountainous areas 2,500 meters above sea level in western North America. They prefer their temperatures cool, their environment moist, and their land to be covered with broken rocks. ",
        "title": "03 FallColorPikaHabitat2",
        "url": "video/FallColorPikaHabitat2.mp4",
        "textPosition": 7,
        "audio": "pikasandambiancebirds"
    },
    {
        "string": "Raising awareness of the causes and consequences of global climate change can alter individual behaviors, but most people quickly respond with avoidance and denial.",
        "title": "04 GallitanGateway",
        "url": "video/GallitanGateway.mp4",
        "textPosition": 9,
        "textStyle": textStyles.basic_italic,
        "audio": "river2"
    },
    {
        "string": "This small mammal resembles its rabbit relatives. Its round, furry body appears cinnamon brown in the summer, but in winter, its fur lengthens and contains more gray hues.",
        "title": "05 Page5",
        "url": "video/Page5.mp4",
        "textPosition": 1,
        "audio": "ravennew"
    },
    {
        "string": "The most negative projection for a species impacted by climate change is death and extinction. As conscious beings, the extinction of our species and the thought of our own mortality causes us stress, so we strive to avoid these thoughts.",
        "title": "06 TreeNHeat",
        "url": "video/TreeNHeat.mp4",
        "textPosition": 6,
        "textStyle": textStyles.basic_italic,
        "audio": null
    },
    {
        "string": "Pikas have a high resting body temperature suited for their cool, mountainous habitat. Air temperatures above even 78°F are lethal, causing pikas to overheat.",
        "title": "07 Page7",
        "url": "video/Page7.mp4",
        "textPosition": 7,
        "audio": "pikasandambiancebirds"
    },
    {
        "string": "According to the Terror Management Theory, we use self-esteem to reduce our existential anxiety associated with thoughts of the inevitability of death.",
        "title": "08 Page8",
        "url": "video/Page8.mp4",
        "textStyle": textStyles.basic_italic,
        "textPosition": 3,
        "audio": "ambiancealittlerustleraven"
    },
    {
        "string": "Since temperatures beneath the rocks remain comfortable for pikas year-round, they use the rocks as structure for their dens and refuge from heat, predators, and snow.",
        "title": "09 PikaDen",
        "url": "video/PikaDen.mp4",
        "textPosition": 4,
        "audio": "clipforpikaeating"
    },
    {
        "string": ["Some cultures value belief in the supernatural, while others appreciate respect for heroism, materialism, nationalism, or artistry. When we perform well according to our cultural worldviews, we feel positively about ourselves.", "This positive feeling gives us the self-esteem we need to ease our stress about death."],
        "title": "10 SnowGlitter",
        "url": "video/SnowGlitter.mp4",
        "textPosition": [6,6],
        "textTransition": "replace",
        "textIndex": 0,
        "textStyle": textStyles.basic_italic,
        "audio": null
    },
    {
        "string": "To survive the frozen winter, pikas store edible vegetation within their dens in the summer, a process called haying. They forage for grasses, flowers, mosses, and lichens.",
        "title": "11 PikaHaysYellowFlowers2",
        "url": "video/PikaHaysYellowFlowers2.mp4",
        "textPosition": 1,
        "audio": "clipforpikaeating"
    },
    {
        "string": "Since we gain self-esteem by achieving our cultural goals, we will defend our worldview in order to protect our level of self-esteem. As we age, we embrace people who think similarly to us and reject those with opposing views.",
        "title": "12 Pallisade",
        "url": "video/Pallisade.mp4",
        "textPosition": 3,
        "textStyle": textStyles.basic_italic,
        "audio": null
    },
    {
        "string": "Pikas remain alert when they hay, vocalizing at every sign of potential predators. Weasels, their most successful predators, slip through the broken rocks to enter pikas’ dens. If pikas avoid predation, they can live up to 7 years.",
        "title": "13 Weasel",
        "url": "video/Weasel.mp4",
        "textPosition": 7,
        "audio": "pikasandambiancebirds"
    },
    {
        "string": "Collective behavior from like-minded individuals through repeatedly validating a shared cultural worldview can cause large-scale impacts, positive and negative.",
        "title": "14 GallatinRiver",
        "url": "video/GallatinRiver.mp4",
        "textPosition": 5,
        "textStyle": textStyles.basic_italic,
        "audio": "river2"
    },
    {
        "string": "These cautious animals currently seem abundant within their range, but wildlife biologists have petitioned the Fish and Wildlife Service twice to list the species as endangered with climate change as their primary threat.",
        "title": "15 Tallus",
        "url": "video/Tallus.mp4",
        "textPosition": 1,
        "audio": "ravennew"
    },
    {
        "string": ["What if a person’s cultural worldview included the importance of conservation and carbon neutrality?", "What if this was an avenue for self-esteem?", "What if people saw sustainable nature as an immortality project?"],
        "title": "16 WoodSnow",
        "url": "video/WoodSnow.mp4",
        "textPosition": [10, 5, 11],
        "textTransition": "persist",
        "textIndex": 0,
        "textStyle": textStyles.basic_italic,
        "audio": null
    },
    {
        "string": ["Climate change models predict temperatures within the American pika’s current range to increase to life-threatening levels over the next 100 years.", "Since pikas already reside at the tops of mountains, there is no place cooler they can go."],
        "title": "17 Page17",
        "url": "video/Page17.mp4",
        "textPosition": [5,5],
        "textTransition": "replace",
        "textIndex": 0,
        "audio": "happybirds"
    },
    {
        "string": '"Only within the moment of time represented by the present century has one species - man - acquired significant power to alter the nature of the world."\n                            Rachel Carson',
        "title": "18 SunsetHyalite",
        "url": "video/SunsetHyalite.mp4",
        "textPosition": 5,
        "textStyle": textStyles.sunrise,
        "audio": null
    },
    {
        "string": ["","","","","","Do you think global climate change is occurring?","Do you think humans contribute to global climate change?","Do you think individuals can make a positive difference concerning global climate change?","What are some ways you have behaviorally responded to global climate change awareness?"],
        "title": "19 BigTruckInSnow",
        "url": "video/BigTruckInSnow.mp4",
        "textPosition": [1,1,1,1,1,2,2,2,2],
        "textTransition": "question",
        "textIndex": 0,
        "audio": null
    },
    {
        "string": ["Created By\nCatherine Mullen", "Code By\nJohn McIntosh", "Music By\nBenoît Pioulard", "Produced as part of the MFA program in\nScience and Natural History Filmmaking\nMontana State University Bozeman\nsfp.montana.edu/sciencenaturefilm"],
        "title": "20 PikaPurpleFlower",
        "url": "video/PikaPurpleFlower.mp4",
        "textPosition": [2, 12, 13, 8],
        "textStyle": [textStyles.basic,textStyles.basic,textStyles.basic,textStyles.centered_basic],
        "audio": null
    },
    {
        "title": "21 GraaWind",
        "url": "video/GraaWind.mp4",
        "textPosition": 7,
        "textIndex": 0,
        "audio": "ambiancealittlerustleraven"
    }
];



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