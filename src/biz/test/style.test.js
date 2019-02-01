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
        new Card('C', '4'),
        new Card('S', '5'),
        new Card('D', '6')
    ];
    let style = findStyle(cards);
    expect(style).toBeNull();

    cards.push(new Card('H', '7'))
    style = findStyle(cards);
    expect(style.name).toBe("SingleConnect");
});