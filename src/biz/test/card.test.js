import Card from '../card';

test("Card heart 2's rank is 13", () => {
    let c = new Card('H', '2');
    expect(c.rank).toBe(13);
});

test("Card heart K's rank is 11", () => {
    let c = new Card('H', 'K');
    expect(c.rank).toBe(11);
});

test("Card heart 3", () => {
    let c = new Card('H', '2');
    expect(c.is3Heart).toBeTruthy();
});