<script>
import {io} from 'socket.io-client'
const socket = io('localhost:9012');

export default {

  data(){
    return {
      view: 'login',
      //redirect_uri: 'https://fgPlaylistAdmin.jonx.dev/callback',
      redirect_uri: 'http://localhost:5173/callback',
      TOKEN: 'https://accounts.spotify.com/api/token',
      AUTHORIZE: 'https://accounts.spotify.com/authorize',
      USER: 'https://accounts.spotify.com/v1/me',

      access_token: undefined,
      refresh_token: undefined,

      client_id: 'afea80e5825a41369360711964384743',
      client_secret: '7ca2edd607974bd4885392e1129705fa',


      pwInput: '',

      addedList: [],
    }
  },
  components: {
    
  },
  props: {
    
  },
  methods: {
    OnPageLoad(){
            if ( window.location.search.length > 0 ){
                this.handleRedirect();
            }
            else{
                this.access_token = localStorage.getItem("access_token");
                if ( this.access_token == null ){
                     localStorage.setItem("login", false);
                     this.RequestAuthorization();
                } else {
                    this.refreshAccessToken();
                }

                
            }
        },

        handleRedirect(){
            let code = this.getCode();
            this.fetchAccessToken( code );
            window.history.pushState("", "", this.redirect_uri); // remove param from url
        },

        getCode(){
            let code = null;
            const queryString = window.location.search;
            if ( queryString.length > 0 ){
                const urlParams = new URLSearchParams(queryString);
                code = urlParams.get('code')
            }
            return code;
        },

        fetchAccessToken( code ){
            let body = "grant_type=authorization_code";
            body += "&code=" + code; 
            body += "&redirect_uri=" + encodeURI(this.redirect_uri);
            body += "&client_id=" + this.client_id;
            body += "&client_secret=" + this.client_secret;
            this.callAuthorizationApi(body);
        },

        callAuthorizationApi(body){
            let xhr = new XMLHttpRequest();
            xhr.open("POST", this.TOKEN, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(this.client_id + ":" + this.client_secret));
            xhr.send(body);

            var tempScope = this;

            xhr.onload = function ()  {
                if ( this.status == 200 ){
                    var data = JSON.parse(this.responseText);
                    tempScope.AuthSuccess(data);
                    var data = JSON.parse(this.responseText);
                    if ( data.access_token != undefined ){
                        this.access_token = data.access_token;
                        localStorage.setItem("access_token", this.access_token); 
                    }
                    if ( data.refresh_token  != undefined ){
                        this.refresh_token = data.refresh_token;
                        localStorage.setItem("refresh_token", this.refresh_token);
                    }
                }
                else {
                    console.log(this.responseText);
                    alert(this.responseText);
                }
            };
        },

        refreshAccessToken(){
            this.refresh_token = localStorage.getItem("refresh_token");
            let body = "grant_type=refresh_token";
            body += "&refresh_token=" + this.refresh_token;
            body += "&client_id=" + this.client_id;
            this.callAuthorizationApi(body);
        },

        RequestAuthorization(){

            let url = this.AUTHORIZE;
            url += "?client_id=" + this.client_id;
            url += "&response_type=code";
            url += "&redirect_uri=" + this.redirect_uri;
            url += "&show_dialog=true";
            url += "&scope=user-library-read user-modify-playback-state user-read-playback-state playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-top-read" ;
            window.location.href = url; // Show Spotify's authorization screen
        },

        CallApi(method, url, body, instruction){
        const currentScope = this;
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer ' + this.access_token);
        xhr.send(JSON.stringify(body));
        xhr.onload = function() {
          if (this.status == 200 || this.status == 201){
              var data = JSON.parse(this.responseText);
              currentScope.doSmtWithData(data, instruction);
          }
          else if ( this.status == 401 ){
            currentScope.$refs.auth_child.refreshAccessToken();
          } else if ( this.status == 204 ){
            if(instruction == "playerState"){
              console.log("player isnt playing");
            }
          }
          else if(this.status == 502 || this.status == 500){
            if(method == "DELETE") {alert("spotify server error while deletion please try again (some items could be duplicated or missing)")};
            currentScope.CallApi(method, url, body, instruction);
            console.log(this.responseURL);
          } else if(this.status == 403){
              if(this.responseText == "Index out of bounds."){
                currentScope.CallApi(method, url, body, instruction);
              }
          } else {
            console.log(this.status);
          }
        };
      },

      doSmtWithData(_data, instruction){
        
      },

      AuthSuccess(data){
        console.log(data);
        //this.view = "main";
      },

      checkPw(pw){
        socket.emit('verifyAdminPw', (pw));
        localStorage.setItem("loginCred", pw);
      },

      addToPlaylist(){
        //spotify
        const _id = "3te5GDqzZdUAYfCZqIFLJb";
        let _addData = {"uris": []};
        for(let i = 0; i < this.addedList.length; i++){
          if(i % 100 == 0 && i != 0){
            this.CallApi("POST", `https://api.spotify.com/v1/playlists/${_id}/tracks`, _addData);
            _addData = {"uris": []};
          }

          _addData.uris.push(this.addedList[i]);
        }
        this.CallApi("POST", `https://api.spotify.com/v1/playlists/${_id}/tracks`, _addData);

        //socket.io
        socket.emit("addedSongsToPlaylist");
      },

  },
  created() {
    const loginStored = localStorage.getItem("loginCred");
    if(loginStored){
      this.checkPw(loginStored);
    };

    socket.on("loggedIn", () => {
      this.view = "main";
    });

    socket.on("addedPlaylist", (_added) => {
      const tempSongs = _added;
      
      tempSongs.forEach(e => {
        this.addedList.push(`spotify:track:${e}`);
      });

      
      console.log(_added);
    });

  },
  mounted(){
    this.OnPageLoad();  
  },
  watch: {
    
  },

}
</script>

<template>
  <div id="login" v-if="view == 'login'">
    <div id="pwWrapper">
      <input placeholder="password" v-model="pwInput" @keyup.enter="this.checkPw(pwInput)">
      <button @click="this.checkPw(pwInput)">Login</button>
    </div>
  </div>

  <div id="main" v-else>
    <button @click="addToPlaylist()">add to Playlist</button>
    <div class="songlist" v-for="song in addedList">
      {{ song }}
    </div>
  </div>
</template>

<style scoped>
#pwWrapper{
    position: absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%);

    width: 30%;
    height: 40%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  input{
    margin-bottom: 10px;
    background-color: transparent;
    border: 1px solid white;
    border-radius: 4px;
  }

  button{
    width: 50%;
    height: 30px;

    background-color: transparent;
    border: 1px solid white;
    border-radius: 4px;
  }
  button:hover{
    cursor: pointer;
  }
</style>