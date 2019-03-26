import * as U from '../biz/user';
import theGame, {createGame} from '../biz/game';

U.checkin("Jon", 0);
let theGame = createGame();
theGame.join("Ivy");
theGame.join("Gallen");
theGame.start()
var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!'
    }
  })