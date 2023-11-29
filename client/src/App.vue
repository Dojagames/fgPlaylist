
<script>
import {io} from 'socket.io-client'
const socket = io('localhost:9012');

import Login from './components/login.vue';
import Main from './components/main.vue';
 

export default {
  data(){
    return {
      view: "login",
      votes: [],
      playlist: [],
    }
  },
  components: {
    Login,
    Main,
  },
  props: {
      
  },
  methods: {
      checkPw(pw){
        socket.emit('verifyPw', (pw));
      },
      AddSong(_song){
        let shortedUrl = _song.split("?")[0];
        let id;

        if(!shortedUrl.includes("open.spotify.com/track/")){
          alert("invalid link");
          return;
        }

        if(shortedUrl.includes(":")) shortedUrl = shortedUrl.substring(8);
        id = shortedUrl.split("/")[2];

        this.votes.push([id, true]);
        localStorage.setItem("votes", JSON.stringify(this.votes));
        socket.emit('addSong', (id));
      }
  },
  created() {
    const loginStored = localStorage.getItem("loginCred");
    if(loginStored){
      this.checkPw(loginStored);
    }

    const votesStored = localStorage.getItem("votes");
    if(votesStored){
      this.votes = JSON.parse(votesStored);
    }

    socket.on("loginFailed", () => {
      alert("login failed");
    });

    socket.on("loggedIn", (pw) => {
      this.view = "main";
      localStorage.setItem("loginCred", pw);
    });

    socket.on("playlist", (_playlist) => {
      this.playlist = _playlist;
    });

  },
  mounted(){
      
  },
  watch: {
      
  },
}
</script>

<template>
  <Login v-if="view === 'login'"></Login>
  <Main v-else :playlist="playlist"></Main>
</template>

<style scoped>
    
</style>