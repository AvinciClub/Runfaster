// Card class
class Card {
    static FACE2RANK = {
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

    // suit - "S", "C", "H", "D"
    // face - '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'
    constructor(suit, face){
        this.suit = suit;
        this.face = face;
        this.rank = Card.FACE2RANK[face]; 
    }
    
    is3Heart(){
        return this.face =='3' && this.suit == 'H';
    }
}


function shuffle(cards){
    let shuffled = []
    while(cards.length > 1){
        let Random = Math.floor(Math.random() * cards.length)-1;
        shuffled.push(cards[Random]);
        cards.splice(Random, 1);
    }
    return shuffled
}

export default Card;
export {shuffle};
