import Card, {shuffle, createCardDeck} from '../card';

test("Card heart 2's rank is 13", () => {
    let c = new Card('H', '2');
    expect(c.rank).toBe(13);
});

test("Card heart K's rank is 11", () => {
    let c = new Card('H', 'K');
    expect(c.rank).toBe(11);
});

test("Card heart 3", () => {
    let c = new Card('H', '3');
    expect(c.is3Heart()).toBeTruthy();
});

test("Shuffle", () => {
    let c = createCardDeck();
    let s1 = shuffle(c.slice());
    expect(s1).not.toEqual(c);
    expect(c.length).toEqual(s1.length)
    for (let i = 0; i < c.length; i++){
        expect(s1).toContain(c[i]);
    }
});

test("Gene", () => {
    let c = new Card('S', '10');
    expect(c.gene).toBe("10S");
})

