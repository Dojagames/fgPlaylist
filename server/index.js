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
    socket.on('verifyPw', (pw) => {
        if(pw == process.env.PW){
            socket.emit("loggedIn", (pw));
            
            socket.emit("playlist", (urlList));
        } else {
            socket.emit("loginFailed");
        }
   });

    socket.on("addSong", async (link) => {
        if(mainPlaylist.includes(link)){
            console.log("test");
            socket.emit("error", ("in Queue"));
            return;
        }
        if(inPlaylist.includes(link)){
            socket.emit("error", ("already in Playlist"));
            return;
        }

        mainPlaylist.push({ url: link, votes: 1, downvotes: 0});
        urlList.push(link);
        await playlistCollection.updateOne({ "_id": "queue"}, {$push: { songs: link }})
    });

    socket.on("voteForSong", async ([link, vote]) => {
        const curIndex = mainPlaylist.indexOf(link);
        if(curIndex == -1) return;
        
        if(vote){
            mainPlaylist[curIndex].votes += 1;
        } else {
            mainPlaylist[curIndex].downvotes += 1;
        };


        if(mainPlaylist[curIndex].votes >= 2){
            addedPlaylist.push(link);
            await playlistCollection.updateOne({"_id": "added"}, {$push: {songs: link}});
        }
        if(mainPlaylist[curIndex].downvotes >= 2){
            declinedPlaylist.push(link);
            await playlistCollection.updateOne({"_id": "declined"}, {$push: {songs: link}});

            mainPlaylist = mainPlaylist.filter((e) => e.url !== link);
            await playlistCollection.updateOne({"_id": "queue"}, {songs: mainPlaylist});
        }
    });
});


async function AddSong(){
    await playlistCollection.insertOne({ "_id": "declined", songs: [
        
    ]})
}


var mainPlaylist = [];
var urlList = [];
var addedPlaylist = [];
var declinedPlaylist = [];

var inPlaylist = [];

server.listen(9012, async () => {
    try {
        await client.connect();
        playlistCollection = client.db("fgPlaylist").collection("List");
        console.log("DB connected...");

        const mainPlaylistAwait = await playlistCollection.findOne({"_id": "queue"});
        if(mainPlaylistAwait.hasOwnProperty("songs")){
            mainPlaylist = mainPlaylistAwait.songs;
            mainPlaylist.forEach(e => {
                urlList.push(e);
            });
        }
        
        addedPlaylist = await playlistCollection.findOne({"_id": "added"});
        
        declinedPlaylist = await playlistCollection.findOne({"_id": "declined"});

        const inPlaylistAwait = await playlistCollection.findOne({"_id": "inPlaylist"});
        if(inPlaylistAwait.hasOwnProperty("songs")){
            inPlaylist = inPlaylistAwait.songs;
        }
        

        //console.log(inPlaylist);
    } catch (e){
        console.error(e);
    }
});