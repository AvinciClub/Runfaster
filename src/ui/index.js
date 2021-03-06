import 'phaser';
import Card, {initialDeck, createDeckGroups} from '../biz/card';

function calcX(starX, angle, radius){
    return starX - radius*Math.cos(angle)
}

function calcY(starY, angle, radius){
    return starY - radius*Math.sin(angle)
}

function calcAngle(angle){
    return 90-angle
}

function radianToDegrees(radian){
    return radian*180/Math.PI;
}

function decorateSprite(s){
    s.popX = 0;
    s.popY = 0;
    s.originX = s.body.x;
    s.originY = s.body.y;
    s.poppedUp = false;

    s.popUp = function(){
        this.setX(this.popX);
        this.setY(this.popY);
        this.poppedUp = true;
    };

    s.dropDown = function(){
        this.setX(this.originX);
        this.setY(this.originY);
        this.poppedUp = false;
    };

    return s;
}


// Size constants
const WIDTH = 900;
const HEIGHT = 900;
const GAMMA = Math.PI/3;
const DECK_RADIUS = 300;

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: WIDTH,
    height: HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);


function loadCards(that){
    const suits = 'SCHD';
    const faces = '3456789JQK';
    for (let s = 0; s < suits.length; s++){
        for (let f = 0; f < faces.length; f++){
            that.load.image(faces[f] + suits[s] , 'assets/cards/' + faces[f] + suits[s] + '.png');
        }
        that.load.image('10' + suits[s], 'assets/cards/10' + suits[s] + '.png');
    }
    that.load.image('AS', 'assets/cards/AS.png');
    that.load.image('AC' , 'assets/cards/AC.png');
    that.load.image('AH', 'assets/cards/AH.png');
    that.load.image('2H', 'assets/cards/2H.png');  
}




function preload()
{
    this.load.image('table', 'assets/table.png');
    this.load.image('back', 'assets/cards/back.png');
    loadCards(this);
}

function create ()
{
    this.bg = this.add.image(WIDTH/2,HEIGHT/2,'table');
    this.bg.setDisplaySize(WIDTH, HEIGHT);
    //Changed later on, Number of Users
    let NumOfUsers = 3
    let CardBiz = createDeckGroups(NumOfUsers)
    let CardsUi = []
    for(let y = 0; y<NumOfUsers; y++){
        CardsUi.push([])
        for(let i = 0; i<CardBiz[y].length; i++){
            if(y == 0){
                let alpha = Math.PI - (Math.PI - GAMMA) / 2 - (GAMMA * (CardBiz[y].length - i))/CardBiz[y].length;
                CardsUi[y].push(decorateSprite(this.physics.add.sprite(calcX(WIDTH/2, alpha, DECK_RADIUS),
                calcY(HEIGHT * 7 / 6, alpha, DECK_RADIUS), 
                CardBiz[y][i].gene).setInteractive()));
                CardsUi[y][i].popX = calcX(WIDTH/2, alpha, DECK_RADIUS * 6/5);
                CardsUi[y][i].popY = calcY(HEIGHT * 7 / 6, alpha, DECK_RADIUS * 6/5);
                CardsUi[y][i].angle = calcAngle(180-radianToDegrees(alpha));
            }
            else if(y==1){
                CardsUi[y].push(this.physics.add.sprite(100, HEIGHT/2-(CardBiz[y].length/2*25)+i*25, 'back'))
                CardsUi[y][i].angle = 90
            }
            else if(y==2){
                CardsUi[y].push(this.physics.add.sprite(WIDTH*7/8, HEIGHT/2-(CardBiz[y].length/2*25)+i*25, 'back'))
                CardsUi[y][i].angle = -90
            }
            else if(y==3){
                CardsUi[y].push(this.physics.add.sprite(WIDTH/2-(CardBiz[y].length/2*25)+i*25, HEIGHT/8, 'back'))
            }
            CardsUi[y][i].setScale(0.3)
            CardsUi[y][i].on('pointerover',function(pointer){
                CardsUi[y][i].popUp();
            })
            CardsUi[y][i].on('pointerout',function(pointer){
                CardsUi[y][i].dropDown();
            })
        }
    }
}
