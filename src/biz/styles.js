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

// findStyle function
let STYLES = [new SingleS()];
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