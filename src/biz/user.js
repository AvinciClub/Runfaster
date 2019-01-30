// User class
class User {
    constructor(name) {
        this._name = name;
    }

    get name(){
        return this._name;
    }
}

export default User;
