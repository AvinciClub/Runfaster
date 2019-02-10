import 'phaser';
import Card, {initialDeck} from '../biz/card';


var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function splitDeck(numOfUsers, deck){
    let length = deck.length;
    let ret = [];
    for(let i = 0; i<numOfUsers-1; i++){
        ret.push(deck.slice(0, Math.floor(length/numOfUsers)));
        deck.splice(Math.floor(length/numOfUsers));
    }
    ret.push(deck)
    return ret
    
}

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
    loadCards(this)
}

function create ()
{
    var logo = this.add.image(400, 150, 'AC');
    //Changed later on, Number of Users
    let NumOfUsers = 3
    let CardBiz = splitDeck(NumOfUsers, initialDeck())
    let CardsUi = []
    for(let y = 0; y<CardBiz.length; y++){
        CardsUi.push([])
        for(let i = 0; i<CardBiz[y].length; i++){
            CardsUi[y].push(this.add.image(i*100, y*100, CardBiz[y][i].face + CardBiz[y][i].suit))

        }
    }
    this.add.sprite(table)
}
