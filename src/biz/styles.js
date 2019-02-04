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

class DoubleConnectS extends Style {
    constructor(){
        super("DoubleConnect");
    }s
    validate(cards){
        for(let i = 0; i < cards.length-1; i++){
            //If even, card and next should be equal, If index odd, next card should be one greater than before
            if((i % 2 == 0 && cards[i].rank == cards[i+1].rank)
                || (i % 2 != 0 && cards[i].rank+1 == cards[i+1].rank)){
                continue;
            }
            else{
                return false;
            }
        }
        return cards.length > 2;
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

class TripleConnectS extends Style {
    constructor(){
        super("TripleConnect");
    }
    validate(cards){
        if(cards.length%3 == 0 && cards.length != 3 && cards.length != 0){
            for(let i = 0; i < cards.length-1; i++){
                if(((i+1) % 3 == 0 && cards[i].rank+1 == cards[i+1].rank)|| 
                    ((i+1) % 3 != 0 && cards[i].rank == cards[i+1].rank)){
                    continue;
                }
                else{
                    return false;
                }
            }
            return true;
        }
        return false;
    }
}
 
class FourBringTwo extends Style {
    constructor(){
        super("FourBringTwo");
    }
    validate(cards){
        if((cards.length == 6) && 
        ((cards[0].rank == cards[1].rank && cards[1].rank == cards[2].rank && cards[2].rank == cards[3].rank) 
        || (cards[5].rank == cards[2].rank && cards[2].rank == cards[3].rank && cards[3].rank == cards[4].rank))){
            return true;
        }
        return false;
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

class TripleBringOneS extends Style {
    constructor(){
        super("TripleBringOne");
    }
    validate(cards){
        if(cards.length == 4){
            if((cards[0].rank == cards[1].rank && cards[1].rank == cards[2].rank) 
                || (cards[1].rank == cards[2].rank && cards[1].rank == cards[3].rank) &&
                (cards[0].rank != cards[3].rank)){
                    return true
                }
        }
        return false
    }
}

// findStyle function
let STYLES = [new SingleS(), new DoubleS(), 
            new SingleConnectS(), new TripleS(), 
            new BombS(), new TripleBringOneS(), 
            new DoubleConnectS(), new TripleConnectS(), new FourBringTwo()];
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