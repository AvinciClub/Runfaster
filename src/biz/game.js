import User, * as U from './user';
import Card, * as C from './card';
import findStyle, * as S from './styles';
import EventEmitter from 'wolfy87-eventemitter';

// Game event object
let gameEvent = new EventEmitter();
// Game events
export const EVT_LOAD = "load";
export const EVT_START = "start";
export const EVT_END = "end";
export const EVT_JOIN = "join";

export const EVT_NEWUSER = "new_user";
export const EVT_NEWACTION = "new_action";



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
        this.passCount = 0; // How many user passed in a row     
        this.winner = null; // Game winner

        // action list
        this.actions = [];

        gameEvent.emitEvent(EVT_LOAD, ["test1", 2]);
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

    // Check whether the draw is valid
    // if 'cards' is null, it means 'pass'
    validateDraw(cards){
        // First draw
        if (this.actions.length == 0){
            if (cards == null) {  // cannot be pass
                return false;
            }
            if (!c.deckContains3Heart(cards)){ // must have heart 3
                return false;
            }
        }

        // keep one at last
        if (this.state[this.curUser].length == cards.length && cards.length != 1){
            return false;
        }
        

        let s = findStyle(cards);
        if (s == null){ // Not valid style
            return false;
        }
        else{
            if (this._isStartOfRound){
                if (s.name == "Pass"){
                    return false;
                }
                return true;
            }
            else{
                if (s.name != this.curStyle.name){
                    if (s.name !== "Pass"){
                        return false;
                    }
                    else{
                        return true;
                    }
                }
                else{
                    if (cards[s.rankIndex] <= this.curStyleRank){
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            }
        }
    }

    draw(cards){
        if (this.users[this.curUser] != U.me){
            throw "It's not your turn.";
        }
        if (validateDraw(cards)){
            // Save action to database
            let action = {user: this.curUser, cards: cards };
        }

    }

    // dispatch the action, this will change the state
    dispatch(action){
        // Book keeping action
        this.actions.push(action);

        // Update state
        if(action.cards != null){
            C.removeFromDeck(this.state[action.user], action.cards);
            // Check winner
            if (this.sate[action.user].length == 0){
                this.winner = action.user;
                //TBD: Emit winner event
                return;
            }
        }
        
        // Set style
        let s = findStyle(action.cards);
        if (this._isStartOfRound()){
            this.curStyle = s;
            this.curStyleRank = action.cards[s.rankIndex];
        }

        // Set pass count
        if (s == 'Pass'){
            this.passCount++;
 
            // Check end of round
            if (this._shouldEndRound()){
                this._endRound();
            }           
        }
        else{
            this.passCount = 0; // reset pass count
        }
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

    _isStartOfRound(){
        return this.curStyle == null;
    }

    _shouldEndRound(){
        return this.passCount == this.users.length - 1;
    }

    _endRound(){
        this.curStyle = null;
        this.curStyleRank = 0;
        this.curUser = this.actions[this.actions.length - this.users.length].user;
        this.passCount = 0;
    }
   
}

let theGame = null;

function createGame(){
    if (!U.isCheckedin()){
        console.log("User not checked in.")
        return;
    }
    theGame = new Game();
    theGame.join(U.me);
    theGame.owner = U.me;
}

export default theGame;
export {Game, createGame, gameEvent};