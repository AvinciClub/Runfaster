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
    constructor(name){
        super(name);
    }
    validate(cards){
        return cards.length == 1;
    }

}