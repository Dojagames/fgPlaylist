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
            socket.emit("allPlaylist", ([mainPlaylist, addedPlaylist, declinedPlaylist]));       
        } else {
            socket.emit("loginFailed");
        }
   });
   
   socket.on('verifyAdminPw', (pw) => {
        if(pw == process.env.ADMIN_PW){
            socket.emit("loggedIn");
            socket.emit("addedPlaylist", (tempAddedList));
        } else {
            socket.emit("loginFailed");
        }
    });

    socket.on("addSong", async (link) => {
        if(mainPlaylist.some(e => e.url == link)){
            console.log("test");
            socket.emit("error", ("in Queue"));
            return;
        }
        if(inPlaylist.includes(link)){
            socket.emit("error", ("already in Playlist"));
            return;
        }
        if(addedPlaylist.includes(link)){
            socket.emit("error", ("already added"));
            return;
        }
        if(declinedPlaylist.includes(link)){
            socket.emit("error", ("already declined"));
            return;
        }

        mainPlaylist.push({ url: link, votes: 1, downvotes: 0});
        await playlistCollection.updateOne({ "_id": "queue"}, {$push: { songs: { url: link, votes: 1, downvotes: 0} }});

        socket.broadcast.emit("playlist", (mainPlaylist));
    });

    socket.on("voteForSong", async ([link, vote]) => {
        let curIndex = -1; //index of function for obj
        for(let i = 0; i < mainPlaylist.length; i++){
            if(mainPlaylist[i].url == link){
                curIndex = i;
                break;
            }
        }
        
        if(curIndex == -1) return;
        
        await playlistCollection.updateOne({"_id": "queue"}, {$pull: {songs:  mainPlaylist[curIndex]}});
        

        if(vote){
            mainPlaylist[curIndex].votes += 1;
        } else {
            mainPlaylist[curIndex].downvotes += 1;
        };


        await checkSongStatus(link, curIndex);

        socket.broadcast.emit("allPlaylist", ([mainPlaylist, addedPlaylist, declinedPlaylist]));
        socket.emit("allPlaylist", ([mainPlaylist, addedPlaylist, declinedPlaylist]));
    });

    socket.on("voteForSongChange", async ([link, vote]) => {
        let curIndex = -1; //index of function for obj
        for(let i = 0; i < mainPlaylist.length; i++){
            if(mainPlaylist[i].url == link){
                curIndex = i;
                break;
            }
        }

        if(curIndex == -1) return;


        await playlistCollection.updateOne({"_id": "queue"}, {$pull: {songs:  mainPlaylist[curIndex]}});

        if(vote){
            mainPlaylist[curIndex].votes += 1;
            mainPlaylist[curIndex].downvotes -= 1;
        } else {
            mainPlaylist[curIndex].votes -= 1;
            mainPlaylist[curIndex].downvotes += 1;
        }


        await checkSongStatus(link, curIndex);

        socket.broadcast.emit("allPlaylist", ([mainPlaylist, addedPlaylist, declinedPlaylist]));
        socket.emit("allPlaylist", ([mainPlaylist, addedPlaylist, declinedPlaylist]));
    });

    socket.on("addedSongsToPlaylist", async () => {

        await playlistCollection.updateOne({"_id": "inPlaylist"}, {$push:{songs: tempAddedList}});
        inPlaylist = inPlaylist.concat(tempAddedList);

        tempAddedList = [];
        await playlistCollection.deleteOne({"_id": "tempAddedList"}); 
        await playlistCollection.insertOne({ "_id": "tempAddedList", songs: []})
        socket.emit("addedPlaylist", (tempAddedList));
    })


});

async function checkSongStatus(_link, _index){
    if(mainPlaylist[_index].votes >= 2){
        addedPlaylist.push(_link);
        tempAddedList.push(_link);

        await playlistCollection.updateOne({"_id": "added"}, {$push: {songs: _link}});
        await playlistCollection.updateOne({"_id": "tempAddedList"}, {$push: {songs: _link}});

        mainPlaylist = mainPlaylist.filter((e) => e.url !== _link);
    } else if(mainPlaylist[_index].downvotes >= 2){
        declinedPlaylist.push(_link);
        await playlistCollection.updateOne({"_id": "declined"}, {$push: {songs: _link}});

        mainPlaylist = mainPlaylist.filter((e) => e.url !== _link);
    } else {
        await playlistCollection.updateOne({"_id": "queue"}, {$push: {songs: mainPlaylist[_index]}});
    }
}


async function AddSong(){
    await playlistCollection.insertOne({ "_id": "tempAddedList", songs: [
        
    ]})
}


var mainPlaylist = [];
var addedPlaylist = [];
var declinedPlaylist = [];
var tempAddedList = [];

var inPlaylist = [];

server.listen(9012, async () => {
    try {
        await client.connect();
        playlistCollection = client.db("fgPlaylist").collection("List");
        console.log("DB connected...");

        const mainPlaylistAwait = await playlistCollection.findOne({"_id": "queue"});
        if(mainPlaylistAwait.hasOwnProperty("songs")){
            mainPlaylist = mainPlaylistAwait.songs;
        }
        
        const addedPlaylistAwait = await playlistCollection.findOne({"_id": "added"});
        if(addedPlaylistAwait.hasOwnProperty("songs")){
            addedPlaylist = addedPlaylistAwait.songs;
        }

        const declinedPlaylistAwait = await playlistCollection.findOne({"_id": "declined"});
        if(declinedPlaylistAwait.hasOwnProperty("songs")){
            declinedPlaylist = declinedPlaylistAwait.songs;
        }

        const inPlaylistAwait = await playlistCollection.findOne({"_id": "inPlaylist"});
        if(inPlaylistAwait.hasOwnProperty("songs")){
            inPlaylist = inPlaylistAwait.songs;
        }

        const tempAddedListAwait = await playlistCollection.findOne({"_id": "tempAddedList"});
        if(tempAddedListAwait.hasOwnProperty("songs")){
            tempAddedList = tempAddedListAwait.songs;
        }
        

        //console.log(inPlaylist);
    } catch (e){
        console.error(e);
    }
});