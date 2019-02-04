import Card, {shuffle} from '../card';

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
    let c = [];
    for(let i = 0; i<25; i++){
        c.push(new Card('H', String(Math.floor(Math.random()*13))));
    }
    let s1 = shuffle(c);
    expect(s1).not.toEqual(c);

    let s2 = shuffle(c);
    expect(s1).not.toEqual(s2)
});

