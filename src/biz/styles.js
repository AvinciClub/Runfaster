import Card from './card'

let STYLES = [];

function findStyle(cards){
    cards.sort((a, b) => a.rank - b.rank);
    for (let i = 0; i < STYLES.length; i++){
        if (STYLES[i].validate(cards)){
            return STYLES[i];
        }
    }
    return null;
}


class Style {
    constructor(name){
        this.name = name;
        STYLES.push(this);
    }

    validate(cards){
        throw "No style, so validate doesn't make sense."
    }
}

class SingleS extends Style {
    constructor(name){
        super(name);
    }
    validate(cards){
        return cards.length == 1;
    }
}

export default findStyle;