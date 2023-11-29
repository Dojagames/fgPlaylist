
<script>
import {io} from 'socket.io-client'
const socket = io('localhost:9012');

import Login from './components/login.vue';
import Main from './components/main.vue';
 

export default {
  data(){
    return {
      view: "login",
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
  },
  created() {
    const loginStored = localStorage.getItem("loginCred");
    if(loginStored){
      this.checkPw(loginStored);
    }

    socket.on("loginFailed", () => {
      alert("login failed");
    });

    socket.on("loggedIn", (pw) => {
      this.view = "main";
      localStorage.setItem("loginCred", pw);
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
  <Main v-else></Main>
</template>

<style scoped>
    
</style>