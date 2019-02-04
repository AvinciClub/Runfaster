import findStyle from '../styles';
import Card from '../card';

test("Single style", () => {
    let cards = [new Card('H', '3')];
    let style = findStyle(cards);
    expect(style.name).toBe("Single");
});

test("Double style", () => {
    let cards = [new Card('H', '3'), new Card('C', '3')];
    let style = findStyle(cards);
    expect(style.name).toBe("Double");
});

test("Triple style", () => {
    let cards = [new Card('H', '3'), 
        new Card('C', '3'),
        new Card('S', '3')];
    let style = findStyle(cards);
    expect(style.name).toBe("Triple");
});

test("Bomb style", () => {
    let cards = [new Card('H', '3'), 
        new Card('C', '3'),
        new Card('S', '3'),
        new Card('D', '3')
    ];
    let style = findStyle(cards);
    expect(style.name).toBe("Bomb");
});

test("Single connect style", () => {
    let cards = [new Card('H', '3'), 
        new Card('S', '5'),    
        new Card('C', '4'),
        new Card('D', '6')
    ];
    let style = findStyle(cards);
    expect(style).toBeNull();

    cards.push(new Card('H', '7'))
    style = findStyle(cards);
    expect(style.name).toBe("SingleConnect");
});


test("Triple bring one", () => {
    let cards = [new Card('H', '4'),
        new Card('S', '4'),
        new Card('D', '4'),    
        new Card('H', 'J'),             
    ];
    let style = findStyle(cards);
    expect(style.name).toBe("TripleBringOne")
    
    cards = [new Card('H', '4'),
        new Card('S', '4'),
        new Card('D', '4'),    
        new Card('H', '3'),             
    ];
    style = findStyle(cards);
    expect(style.name).toBe("TripleBringOne")    
});

test("Double Connect", () => {
    let cards = [new Card('H', '4'),
        new Card('S', '4'),
        new Card('D', '5'),    
        new Card('H', '5'),             
    ];
    let style = findStyle(cards);
    expect(style.name).toBe("DoubleConnect")
    
    cards = [new Card('H', '7'),
        new Card('S', '7'),
        new Card('D', '8'),    
        new Card('H', '8'), 
        new Card('D', '6'),    
        new Card('H', '4'),             
    ];
    style = findStyle(cards);
    expect(style).toBeNull();    
});

test("Triple Connect", () => {
    let cards = [new Card('H', '4'),
        new Card('S', '4'),
        new Card('D', '4'),    
        new Card('D', '5'), 
        new Card('C', '5'), 
        new Card('H', '5'),             
    ];
    let style = findStyle(cards);
    expect(style.name).toBe("TripleConnect")
    
    cards = [new Card('H', '7'),
        new Card('S', '7'),
        new Card('D', '8'),    
        new Card('H', '8'), 
        new Card('D', '6'),    
        new Card('H', '4'),             
    ];
    style = findStyle(cards);
    expect(style).toBeNull();    
});

test("FourBringTwo", () => {
    let cards = [new Card('H', '4'),
        new Card('S', '4'),
        new Card('D', '4'),    
        new Card('C', '4'), 
        new Card('H', '5'), 
        new Card('D', '5'),           
    ];
    let style = findStyle(cards);
    expect(style.name).toBe("FourBringTwo")

    cards[4] = new Card('S', '3');
    cards[5] = new Card('C', '3');
    style = findStyle(cards);
    expect(style.name).toBe("FourBringTwo");

    cards.push(new Card('H', '3'));
    style = findStyle(cards);
    expect(style).toBeNull();


    
    cards = [new Card('H', '7'),
        new Card('S', '7'),
        new Card('D', '8'),    
        new Card('H', '8'), 
        new Card('D', '6'),    
        new Card('H', '4'),             
    ];
    style = findStyle(cards);
    expect(style).toBeNull();    
});