import 'phaser';
import Card, {initialDeck, createDeckGroups} from '../biz/card';


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
    //Changed later on, Number of Users
    let NumOfUsers = 3
    let CardBiz = createDeckGroups(NumOfUsers)
    let CardsUi = []
    for(let y = 0; y<CardBiz.length; y++){
        CardsUi.push([])
        for(let i = 0; i<CardBiz[y].length; i++){
            CardsUi[y].push(this.add.image(i*50, y*100, CardBiz[y][i].gene))
            CardsUi[y][i].setScale(0.15)
        }
    }
    this.add.sprite(400,310,'table').setScale(0.9)
}
