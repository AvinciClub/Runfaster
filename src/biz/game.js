import User, * as U from './user';
import Card, * as C from './card';

class Game {
    constructor(){
        // book keeping properties
        this.startTime = null; // start time
        this.endTime = null; // end time
        this.users = []; // All paticipating users
        this.owner = null; // The user created this game

        // state related properties
        this.state = []; // State is an object of mapping of user->cards
        this.curUser = -1; // User on turn
        this.curStyle = null; // current style 
        this.curStyleRank = 0; // current style rank       
        this.winner = null; // Game winner

        // action list
        this.actions = [];
    }

    // join a game
    join(user){
        if (this.users.length < 3){
            if (this.users.length == 1){
                this.owner = user;
            }
            this.users.push(user);
        }
        else
            console.log("No seat left for the game.")
    }
    start(){
        if (this.canStart()){
            // Initialize state
            cardGroups = C.createDeckGroups(this.users.length);
            for (let i = 0; i < this.users.length; i++){
                this.state.push(cardGroups[i]);
                // Set current user
                if (curUser == -1){
                    if (C.deckContains3Heart(cardGroups[i])){
                        this.curUser = i;
                    }   
                }
            }
        }
    }

    // Check whether the action is valid
    // action is an object with 'user' and 'cards' properties.
    // action represents one user draw some cards.
    // if 'cards' property is null, it means 'pass'
    validateAction(action){
        if (action != null && action.cards.length == 0){ // Not pass must have cards
            return false;
        }
        // First draw
        if (this.actions.length == 0){

            if (action == null) {  // cannot be pass
                return false;
            }
            if (!c.deckContains3Heart(action.cards)){
                return false;
            }

        }
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

    _nextUser(){
        if (this.curUser == this.users.length - 1){
            this.curUser = 0;
        }
        else{
            this.curUser++;
        }       
    }
    
    _drawCards(action){
        let deck = this.state[action.user];
        for (let c of deck){

        }
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