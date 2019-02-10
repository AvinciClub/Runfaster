import User, * as U from './user';

class Game {
    constructor(){
        // book keeping properties
        this.startTime = null; // start time
        this.endTime = null; // end time
        this.users = []; // All paticipating users
        this.owner = null; // The user created this game

        // state related properties
        this.state = {}; // State is an object of mapping of user->cards
        this.curUser = null; // User on turn
        this.curStyle = null; // current style        
        this.winner = null; // Game winner
    }

    join(user){
        if (this.users.length < 3)
            this.users.push(user);
        else
            console.log("No seat left for the game.")
    }
    start(){
        if (this.canStart()){

        }

    }

    // Check whether the action is valid
    // action is an object with 'user' and 'cards' properties.
    // action represents one user draw some cards.
    // if 'cards' property is null, it means 'pass'
    validateAction(action){
        if (!action){
            return false;
        }

    }

    // dispatch the action, this will change the state
    dispatch(action){

    } 
    
 
    canStart(){
        return this.users.length >= 3;
    }
   
   
}

let theGame = null;

function createGame(){
    if (!U.isCheckedin()){
        console.log("User not checked in.")
        return;
    }
    theGame = new Game();
    jone(U.me);
    theGame.owner = me;
}

export default theGame;
export {Game, createGame};