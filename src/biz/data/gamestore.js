const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

class GameStore {
    constructor(){
        var config = {
            apiKey: "AIzaSyCTQVRbS5IQ51s68OGTFqjaS9W_r8fKnow",
            authDomain: "runfaster-755a4.firebaseapp.com",
            databaseURL: "https://runfaster-755a4.firebaseio.com",
            projectId: "runfaster-755a4",
            storageBucket: "runfaster-755a4.appspot.com",
            messagingSenderId: "1018874243785"
          };
          firebase.initializeApp(config);
          this._db = firebase.firestore();
          this.root = ""
    }

    async load(gameObj){
        // Check game id
        var urlParams = new URLSearchParams(window.location.search);
        let id = 'new'
        if (urlParams.has('id')){
            id = urlParams.get('id');
        }

        this._rootPath = "games/" + id;
        this._usersPath = this._rootPath + "/users";
        this._actionsPath = this._rootPath + "/actions";

        this.rootRef = this._db.doc(this._rootPath);
        this.usersRef = this._db.collection(this._usersPath);
        this.actionsRef = this._db.collection(this._actionsPath);

        let root = await this.rootRef.get();
        if (root && root.exists){
            let userSnap = await this.usersRef.get();
            gameObj.users = [];
            userSnap.forEach(function(doc){
                gameObj.users.push(doc.data().name);
            });
            
        }
        else{
            await this.rootRef.set({name: "Run Faster"});
            await this.usersRef.add({name: "test1"});
            await this.usersRef.add({name: "test2"});
        }

        this.rootRef.onSnapshot(function(doc){
            let gameSnap = doc.data();
            if (gameObj.startTime === null && gameSnap.startTime){
                // game started. Update game state)
            }
        });

        this.usersRef.onSnapshot(function(snapShot){
            snapShot.docChanges().forEach(function(change){
                if (change.type === 'added'){
                    gameObj._joined(change.doc.data().name);
                }
            });
        });

    }
}

let Store = new GameStore();
export default Store;