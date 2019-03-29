import * as U from '../biz/user';
import theGame, {createGame} from '../biz/game';

let theGame = createGame();

theGame.onJoin = function(user){
  app.users = theGame.users;
  app.canStart = theGame.canStart();
}

theGame.onStart = function(){
  app.state = theGame.state;
  app.users = theGame.users;
  app.curUser = theGame.curUser;
}

//theGame.start()
var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      user: 'test',
      users: theGame.users,
      canStart: false,
      state:{}
    },
    methods: {
      join: function(){
        theGame.join(this.user);
      },
      start: function(){
        theGame.start();
      },
      isMyTurn: function(user){
        return theGame.users[theGame.curUser] == user;
      }
    },
    mounted: function () {
      Metro.init();
    }    
  });
