import User, * as U from './user';
import Card, * as C from './card';
import findStyle, * as S from './styles';
import Store from './data/gamestore';
//mport EventEmitter from 'wolfy87-eventemitter';

// Game event object
//let gameEvent = new EventEmitter();
// Game events
//export const EVT_LOAD = "loaded";
//export const EVT_START = "started";
//export const EVT_END = "ended";
//export const EVT_NEWUSER = "new_user";
//export const EVT_NEWACTION = "new_action";



class Game {
    constructor(){
        // book keeping properties
        this.startTime = null; // start time
        this.endTime = null; // end time
        this.users = []; // All paticipating users
        this.owner = null; // The user created this game

        // state related properties
        this.state = {}; // State is an object of mapping of user->cards
        this.curUser = -1; // User on turn
        this.curStyle = null; // current style 
        this.curStyleRank = 0; // current style rank  
        this.passCount = 0; // How many user passed in a row     
        this.winner = null; // Game winner

        // action list
        this.actions = [];

        // call backs - UI layer need hook these callbacks
        this.onLoad = null;
        this.onStart = null;
        this.onJoin = null;
        this.onAction = null;

        //gameEvent.emitEvent(EVT_LOAD, ["joined", 2]);
    }

    // Routines to be called by UI layer
    // load 
    load() {
        // Check whether store has the game. If not save it to store.
        Store.load(this).then(function(){
            console.log("Game loaded from Store.");
            if (this.onLoad){
                this.onLoad(this);
            }
        }.bind(this));
    }

    join(user) {
        // Check whether user already in, if not push to store.
        if (this.users.length >= 4){
            console.log("No seat for this game.");
            return;
        }
        if (!this.users.includes(user)){
            Store.pushUser(user).then(function(){
                console.log("User " + user + ' pushed.');
            });
        }
    }

    start(){
        if (this.canStart()){
            // Initialize state
            let state = {};
            let cardGroups = C.createDeckGroups(this.users.length);
            for (let i = 0; i < this.users.length; i++){
                state[this.users[i]] = cardGroups[i];
                // Set current user
                //if (curUser == -1){
                //    if (C.deckContains3Heart(cardGroups[i])){
                //        this.curUser = i;
                //    }   
                //}
            }
            Store.pushStart(state).then(function(){
                console.log("Start game pushed.");
            });
        }
    }

    draw(cards) {
        // Validate action and push to store.
        let curUser = this.users[this.curUser];
        if (curUser != U.me){
            throw "It's not your turn.";
        }
        if (validateDraw(cards)){
            // Save action to database
            let action = {user: curUser, cards: cards };
            Store.pushAction(action).then(function(){
                console.log("Action pushed.");
            });
        }
    }

    // Routines to be called by data layer
    _joined(user) {
        // add user
        if (this.users.length < 4){
            if (this.users.length == 0){
                this.owner = user;
            }
            this.users.push(user);
        }
        else
            console.log("No seat left for the game.")
          
        // call back
        if (this.onJoin){
            this.onJoin(user)
        }
        //gameEvent.emitEvent(EVT_NEWUSER, user)
    }

    _started(state) {
        // Assign initial state
        Object.assign(this.state, state);

        // Set current user
        if (curUser == -1){
            if (C.deckContains3Heart(cardGroups[i])){
                this.curUser = i;
            }   
        }

        // Call back
        if (this.onStart){
            this.onStart(this.state)
        }
        //gameEvent.emitEvent(EVT_START)
    }

    _newAction(action) {
        if (action.user != this.curUserName)
            console.log("Turn messed up! " + action.user + ":" + this.curUserName);
        if (!__validateDraw(action.cards)){
            console.log("Invalid draw from user " + action.user);
        }
        this.actions.push(action);
        __dispatch(action);
        __nextUser();
        // add actions and change state
        if (this.onAction){
            this.onAction(action)
        }
        
    }

    // Check whether the draw is valid
    // if 'cards' is null, it means 'pass'
    __validateDraw(cards){
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

    // dispatch the action, this will change the state
    __dispatch(action){
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

    __nextUser(){
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
        this.curUser = thisUsrIndex(this.actions[this.actions.length - this.users.length].user);
        this.passCount = 0;
    }

    get curUserName(){
        if (this.curUser == -1 || this.users.length == 0)
            return "";
        else
            return this.users[this.curUser];
    }

    get roundEnded(){
        return this.curStyle == null;
    }

    userIndex(user){
        for (let i = 0; i < this.users.length; i++){
            if (this.users[i] == user){
                return i;
            }    
        }
        return -1;
    }
   
}

//let theGame = null;

function createGame(){
    //if (!U.isCheckedin()){
    //    console.log("User not checked in.")
    //    return;
    //}
    let theGame = new Game();
    theGame.load();
    //theGame.join(U.me.name);
    //theGame.owner = U.me.name;

    return theGame;


}

//export default theGame;
export {Game, createGame};