import User, * as U from './user';
import Card, * as C from './card';
import findStyle, * as S from './styles';
import Store from '../data/gamestore';
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
        this.onInfo = null;
        this.onNewRound = null;
        this.onEndGame = null;

        //gameEvent.emitEvent(EVT_LOAD, ["joined", 2]);
    }

    // Routines to be called by UI layer
    // load 
    load() {
        // Check whether store has the game. If not save it to store.
        Store.load(this).then(()=>{
            this.__report(3, "Game loaded from Store.");
            if (this.onLoad){
                this.onLoad(this);
            }
        });
    }

    join(user) {
        // Check whether user already in, if not push to store.
        if (this.users.length >= 4){
            this.__report(1, "No seat for this game.");
            return;
        }
        if (!this.users.includes(user)){
            Store.pushUser(user).then(()=>{
                this.__report(2, "User " + user + ' pushed.');
            });
        }
    }

    start(){
        if (this.canStart()){
            // Initialize state
            let state = {};
            let cardGroups = C.createDeckGroups(this.users.length);
            for (let i = 0; i < this.users.length; i++){
                state[this.users[i]] = cardGroups[i].map(function(v){
                    return Object.assign({}, v);
                });
                // Set current user
                //if (curUser == -1){
                //    if (C.deckContains3Heart(cardGroups[i])){
                //        this.curUser = i;
                //    }   
                //}
            }
            Store.pushStart(state).then(()=>{
                this.__report(3, "Start game pushed.");
            });
        }
    }

    pass(){
        this.draw([]);
    }

    draw(cards) {
        // Validate action and push to store.
        let curUser = this.users[this.curUser];
        //if (curUser != U.me){
        //    throw "It's not your turn.";
        //}
        if (this.__validateDraw(cards)){
            // Save action to database
            let action = {user: curUser, cards: cards.map((v)=>{
                return Object.assign({}, v)
            }) };
            Store.pushAction(action).then(() => {
                this.__report(4, "Action pushed.");
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
            this.__report(1, "No seat left for the game.")
          
        // call back
        if (this.onJoin){
            this.onJoin(user)
        }
        //gameEvent.emitEvent(EVT_NEWUSER, user)
    }

    _started(state) {
        // Assign initial state
        this.users = [];
        for (const k in state){
            this.state[k] = state[k].map((v)=>{
                return new Card(v.suit, v.face)
            });
            this.users.push(k);
        }

        // Set current user
        if (this.curUser == -1){
            for (const k in this.state){
                if (C.deckContains3Heart(this.state[k])){
                    this.curUser = this.users.indexOf(k);
                    break;
                } 
            }
  
        }

        // Call back
        if (this.onStart){
            this.onStart(this.state)
        }

        this.__report(3, 'Game started. You turn, ' + this.curUserName);
        //gameEvent.emitEvent(EVT_START)
    }

    _newAction(action) {
        if (action.user != this.curUserName){
            this.__report(1, "Turn messed up! " + action.user + ":" + this.curUserName);
            return;
        }

        let actionEx = {};
        actionEx.user = action.user;
        actionEx.cards = action.cards.map((v)=>{
            return new Card(v.suit, v.face);
        });

        if (!this.__validateDraw(actionEx.cards)){
            this.__report(1, "Invalid draw from user " + actionEx.user);
            return;
        }        
        //this.actions.push(actionEx);
        this.__dispatch(actionEx);
        this.__nextUser();
        // add actions and change state
        if (this.onAction){
            this.onAction(actionEx)
        }
        this.__report(3, "Your turn: " + this.curUserName);
        
    }

    // Check whether the draw is valid
    // if 'cards' is null, it means 'pass'
    __validateDraw(cards){
        if (this._isStartOfRound()){
            if (cards.length == 0) {  // cannot be pass
                this.__report(1, "You cannot pass at start of round.");
                return false;
            }
        }
        if (this.actions.length == 0){ // First draw        
            if (!C.deckContains3Heart(cards)){ // must have heart 3
                this.__report(1, "Your draw has to include heart 3.");
                return false;
            }
        }

        // keep one at last
        if (this.state[this.curUserName].length == cards.length && cards.length != 1){
            this.__report(1, "Your need Baodan!");
            return false;
        }
        

        let s = findStyle(cards);
        if (s == null){ // Not valid style
            this.__report(1, "Invalid Style!");
            return false;
        }
        else{
            if (this._isStartOfRound()){
                if (s.name == "Pass"){
                    this.__report(1, "Start of round cannot pass.");
                    return false;
                }
                return true;
            }
            else{
                if (s.name != this.curStyle.name){
                    if (s.name !== "Pass"){
                        this.__report(1, "Current round style is " + this.curStyle.name);
                        return false;
                    }
                    else{
                        return true;
                    }
                }
                else{
                    if (cards[s.rankIndex].rank <= this.curStyleRank){
                        this.__report(1, "Card rank is too small.");
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
            if (this.state[action.user].length == 0){
                this.winner = action.user;
                this.__report(1, this.winner + "Won the game!");
                if (this.onEndGame){
                    this.onEndGame(this.winner);
                }
                //TBD: Emit winner event
                return;
            }
        }
        
        // Set style
        let s = findStyle(action.cards);
        if (this._isStartOfRound()){
            this.__report(3, "New round started.");
            this.curStyle = s;
            this.curStyleRank = action.cards[s.rankIndex].rank;
        }

        // Set pass count
        if (s.name == 'Pass'){
            this.passCount++;
 
            // Check end of round
            if (this._shouldEndRound()){
                this._endRound();
                if (this.onNewRound){
                    this.onNewRound(this.curUserName);
                }
                this.__report(3, "New round.");
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

    __report(level, message){
        console.log(message);
        if (this.onInfo){
            this.onInfo(level, message);
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
        //this.curUser = this.UsrIndex(this.actions[this.actions.length - this.users.length].user);
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