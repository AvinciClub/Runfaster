// User class
class User {
    constructor(name, score = 0) {
        this.name = name;
        this.score = score;
    }
}

let me = null;

function checkin(name, score){
    me = new User(name, score);
}

function isCheckedin(){
    return me != null;
}

export default User;
export {me, checkin, isCheckedin};
