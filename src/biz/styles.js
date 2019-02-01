import Card from './card'



class Style {
    constructor(name){
        this.name = name;
    }

    validate(cards){
        throw "No style, so validate doesn't make sense."
    }
}

class SingleS extends Style {
    constructor(){
        super("Single");
    }
    validate(cards){
        return cards.length == 1;
    }
}

class DoubleS extends Style {
    constructor(){
        super("Double");
    }
    validate(cards){
        return cards.length == 2 && cards[0].rank == cards[1].rank;
    }
}

class SingleConnectS extends Style {
    constructor(){
        super("SingleConnect");
    }
    validate(cards){
        for(let i = 0; i < cards.length-1; i++){
            if(cards[i].rank+1 == cards[i+1].rank){
                continue;
            }
            else{
                return false
            }
        }
        return cards.length >= 5;
    }
}

class TripleS extends Style {
    constructor(){
        super("Triple");
    }
    validate(cards){
        return cards.length == 3 
            && cards[0].rank == cards[1].rank 
            && cards[0].rank == cards[2].rank;
    }
}

class BombS extends Style {
    constructor(){
        super("Bomb");
    }
    validate(cards){
        return cards.length == 4 
            && cards[0].rank == cards[1].rank 
            && cards[0].rank == cards[2].rank 
            && cards[0].rank == cards[3].rank;
    }
}

// findStyle function
let STYLES = [new SingleS(), new DoubleS(), new SingleConnectS(), new TripleS(), new BombS()];
function findStyle(cards){
    cards.sort((a, b) => a.rank - b.rank);
    for (let i = 0; i < STYLES.length; i++){
        if (STYLES[i].validate(cards)){
            return STYLES[i];
        }
    }
    return null;
}


export default findStyle;