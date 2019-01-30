import User from "../user";

test("user name", () => {
    expect((new User("Hello")).name).toBe("Hello");
})