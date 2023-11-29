require('dotenv').config();
const {MongoClient} = require('mongodb');

const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

var playlistCollection;

io.on('connection', (socket)=> {
    socket.on('verifyPw', (pw) =>{
        if(pw == process.env.PW){
            socket.emit("loggedIn", (pw));
        } else {
            socket.emit("loginFailed"); 
        }
   })
});





server.listen(9012, async () => {
    try {
        await client.connect();
        playlistCollection = client.db("fgPlaylist-local").collection("List");
        console.log("DB connected...");
    } catch (e){
        console.error(e);
    }
});