import 'phaser';

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
    let ret = [];
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
    this.load.image('logo', 'assets/logo.png');
    loadCards(this)
}

function create ()
{
    var logo = this.add.image(400, 150, 'AC');

    this.tweens.add({
        targets: logo,
        y: 450,
        duration: 2000,
        ease: 'Power2',
        yoyo: true,
        loop: -1
    });

}
