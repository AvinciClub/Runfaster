const FACE2RANK = {
    '3': 1,
    '4': 2,
    '5': 3,
    '6': 4,
    '7': 5,
    '8': 6,
    '9': 7,
    '10': 8,
    'J': 9,
    'Q': 10,
    'K': 11,
    'A': 12,
    '2': 13
};

// Card class
class Card {
    // suit - "S", "C", "H", "D"
    // face - '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'
    constructor(suit, face){
        this.suit = suit;
        this.face = face;
        this.rank = FACE2RANK[face]; 
    }
    
    is3Heart(){
        return this.face =='3' && this.suit == 'H';
    }

    get gene(){
        return this.face + this.suit;
    }
}

// Create initial card dech for runfaster
function createCardDeck(){
    let ret = [];
    const suits = 'SCHD';
    const faces = '3456789JQK';
    for (let s = 0; s < suits.length; s++){
        for (let f = 0; f < faces.length; f++){
            ret.push(new Card(suits[s], faces[f]));
        }
        ret.push(new Card(suits[s], '10'));
    }
    ret.push(new Card('S', 'A'));
    ret.push(new Card('C', 'A'));
    ret.push(new Card('H', 'A'));
    ret.push(new Card('H', '2'));  
    return ret;  
}

// Shuffle cards
function shuffle(cards){
    let shuffled = []
    while(cards.length > 0){
        let Random = Math.floor(Math.random() * cards.length);
        shuffled.push(cards[Random]);
        cards.splice(Random, 1);
    }
    //shuffled.push(cards[0])
    return shuffled
}

function initialDeck(){
    return shuffle(createCardDeck());
}

function splitDeck(numOfUsers, deck){
    let length = deck.length;
    let ret = [];
    for(let i = 0; i<numOfUsers-1; i++){
        ret.push(deck.slice(0, Math.floor(length/numOfUsers)));
        deck = deck.slice(Math.floor(length/numOfUsers), deck.length);
    }
    ret.push(deck)
    return ret
}

function createDeckGroups(numOfGroups){
    return splitDeck(numOfGroups, initialDeck());
}

function deckContains(suit, face, deck){
    for (let c of deck){
        if (c.suit == suit && c.fac == face){
            return true;
        }
    }
    return false;
}

function deckContains3Heart(deck){
    return deckContains('H', '3');
}

function removeFromDeck(deck, cards){
    for (let c of cards){
        let index = deck.findIndex((e) => {
            e.gene == c.gene;
        });
        if (index != -1){
            deck.splice(index);
        }
    }
}

export default Card;
export {shuffle, createCardDeck, initialDeck, createDeckGroups,
    deckContains, deckContains3Heart, removeFromDeck};
