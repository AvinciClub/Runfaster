import * as U from '../biz/user';
import theGame, {createGame} from '../biz/game';

let theGame = createGame();

theGame.onJoin = function(user){
  app.users = theGame.users;
  app.canStart = theGame.canStart();
};

theGame.onStart = function(){
  app.state = theGame.state;
  app.users = theGame.users;
  app.curUser = theGame.curUser;

  for (let u in app.state){
    app.state[u].forEach(c => {
      c.selected = false;      
    });
  }
};

theGame.onInfo = function(level, message){
  app.info = message;
};

theGame.onAction = function(action){
  app.state = theGame.state;
  app.users = theGame.users;
  app.curUser = theGame.curUser;

  for (let u in app.state){
    app.state[u].forEach(c => {
      c.selected = false;      
    });
  }

  if (action.cards.length > 0)
  app.curCards = action.cards;
};

theGame.onNewRound = function(){
  console.log("new round started");
  app.curCards = [];
};

theGame.onEndGame = function(winner){
  alert("Game ended! " + winner + " won!");
};

//theGame.start()
var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      user: 'test',
      users: theGame.users,
      canStart: false,
      info: "",
      state:{},
      curCards: [],
      owners: []
    },
    methods: {
      join: function(){
        theGame.join(this.user);
        this.owners.push(this.user);
      },
      start: function(){
        theGame.start();
      },
      isMyTurn: function(user){
        return theGame.users[theGame.curUser] == user;
      },
      selectCard: function(c, u){
        if (this.owners.contains(u)){
          if (this.isMyTurn(u)){
            c.selected = (!c.selected);
            this.$forceUpdate();
          }
        }
      },
      draw: function(){
        if (!this.owners.contains(theGame.curUserName)){
          return;
        }
        let cards = [];
        this.state[theGame.curUserName].forEach((c)=>{
          if (c.selected)
            cards.push(c);
        })
        theGame.draw(cards);
      },
      pass: function(){
        if (!this.owners.contains(theGame.curUserName)){
          return;
        }
        theGame.pass();
      }
    },
    mounted: function () {
      Metro.init();
    }    
  });
