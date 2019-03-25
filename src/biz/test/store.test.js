import Store from '../data/gamestore'

test("Store", async () => {
    var game = {}
    await Store.load(game);
    expect(game.users.length).toBe(2);
});