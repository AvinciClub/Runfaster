import * as U from '../biz/user';
import theGame, {createGame} from '../biz/game';

U.checkin("Jon", 0);
let theGame = createGame();
theGame.onLoad = function(game){
  app.users = theGame.users;  
}

theGame.onJoin = function(user){
  app.users = theGame.users;
}
//theGame.start()
var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      user: 'test',
      users: theGame.users      
    },
    methods: {
      join: function(){
        theGame.join(this.user);
      }
    },
    mounted: function () {
      Metro.init();
    }    
  });
