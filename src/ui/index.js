import 'phaser';
import Card, {initialDeck, createDeckGroups} from '../biz/card';

function calcX(starX, angle, radius){
    return starX + radius*Math.cos(angle)
}

function calcY(starY, angle, radius){
    return starY + radius*Math.sin(angle)
}

function calcAngle(angle){
    return 90-angle
}


// Size constants
const WIDTH = 700;
const HEIGHT = 700;

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: WIDTH,
    height: HEIGHT,
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
                CardsUi[y].push(this.add.image(calcX(400, -Math.PI/CardBiz[y].length * (i+1),200),
                calcY(500, -Math.PI/CardBiz[y].length * (i+1),200), 
                CardBiz[y][i].gene))
                CardsUi[y][i].angle = calcAngle(180/CardBiz[y].length * (i+1))
                console.log(180/CardBiz[y].length * (i+1))
            }
            else{
                CardsUi[y].push(this.add.image('back'))
            }
            CardsUi[y][i].setScale(0.15)
        }
    }
}
