import User from "../user";

test("User hello with initial score", () => {
    let u = new User("Hello");
    expect(u.name).toBe("Hello");
    expect(u.score).toBe(0);
});