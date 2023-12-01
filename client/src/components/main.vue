<!-- 
    add track
    vote for tracks
    maybe vote for remove?
 -->
<script>
export default {

  data(){
    return {
        inputLink: "",
        currentPanel: "Pending",
        AddModal: false,
    }
  },
  components: {
    
  },
  props: {
    playlist: Array,
    added: Array,
    declined: Array,
    voted: Array,
  },
  methods: {
    getSpotifyEmbed(link){
      return "https://open.spotify.com/embed/track/" + link +"?utm_source=generator "
    },

    getSongVote(song){
      for(let i = 0; i < this.voted.length; i++){
        if(this.voted[i][0] == song){
          if(this.voted[i][1]){
            return "yes";
          } else {
            return "no";
          }
        }
      }
      return undefined;
    },

    openAddModal(){

    },

    clodeAddModal(){

    },

  },
  created() {
    
  },
  mounted(){
    
  },
  watch: {
    
  },
  computed: {
    sortedByVote: function (){
      const songs = [... this.playlist];
      let front = [];
      let back = [];

      songs.forEach(e => {

        if(this.voted.some((f) => f[0] == e.url)){
          back.push(e);
        } else {
          front.push(e)
        }
      });

      return front.concat(back);
    }
  }

}
</script>

<template>
  <h1 style="text-align: center;">2. Versuch lets goo</h1>
    <div id="AddModal" v-if="AddModal" style="position: absolute; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.705); left: 0; top: 0; z-index: 10; " @click.self="AddModal = false;">
      <div id="searchPanel" style="background-color: rgb(85, 85, 85); width: 80%; height: fit-content; padding-top: 5px; padding-bottom: 15px; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); border-radius: 4px;">
        <input placeholder="spotify link" class="inputField" v-model="inputLink" style="width: 98%; margin: 1%; padding: 0; font-size: 1.2rem;">
        <button class="inputBtn" @click="this.$parent.AddSong(inputLink); inputLink = ''; AddModal = false;" style="width: 25%; margin-left: 37.5%; font-size: 1.4rem; font-weight: bold; letter-spacing: 2px;">Add</button>
      </div>
    </div>

    <div id="add">
      <img src="src/assets/add.png" style="width: 64px; position: absolute; z-index: 1; right: 35px; bottom: 105px;" @click="AddModal = true;">
    </div>

    <div class="mainPanel" :style="(currentPanel == 'Pending')? 'display:flex': 'display:none;'">
      <div v-for="song in sortedByVote" class="songPanel">
        <iframe style="border-radius:12px; position: relative; margin-top: 10px;left: 50%; transform: translateX(-50%);" 
        :src= getSpotifyEmbed(song.url)
        width="350" height="152" frameBorder="0" allowfullscreen="" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"></iframe><br>

        <div class="buttonWrapper" v-if="getSongVote(song.url) == 'yes'">
          <button class="clickable" style="border-color: rgb(96, 179, 103); color: rgb(96, 179, 103);">Yes - {{ song.votes }}</button>
          <button class="clickable" style="border-color: rgb(63, 63, 63); color: rgb(63, 63, 63);" @click="this.$parent.changeVote(song.url, false)">No - {{ song.downvotes }}</button>
        </div>
        <div class="buttonWrapper" v-else-if="getSongVote(song.url) == 'no'">
          <button class="clickable" style="border-color: rgb(63, 63, 63); color: rgb(63, 63, 63);" @click="this.$parent.changeVote(song.url, true)">Yes - {{ song.votes }}</button>
          <button class="clickable" style="border-color: rgb(163, 108, 97); color: rgb(163, 108, 97);">No - {{ song.downvotes }}</button>
        </div>
        <div class="buttonWrapper" v-else>
          <button class="clickable" style="border-color: rgb(20, 218, 20); color: rgb(20, 218, 20);" @click="this.$parent.setVote(song.url, true)">Yes - {{ song.votes }}</button>
          <button class="clickable" style="border-color: rgb(236, 97, 4); color: rgb(236, 97, 4);" @click="this.$parent.setVote(song.url, false)">No - {{ song.downvotes }}</button>
        </div>

      </div>
    </div>

    <div class="mainPanel" :style="(currentPanel == 'Accepted')? 'display:flex': 'display:none;'">
      <div v-for="song in added" class="songPanel" style="width: fit-content; height: fit-content; padding: 10px 20px;">
        <iframe style="border-radius:12px; position: relative; margin-top: 10px;left: 50%; transform: translateX(-50%);" 
        :src= getSpotifyEmbed(song)
        width="250" height="152" frameBorder="0" allowfullscreen="" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"></iframe>
      </div>
    </div>

    <div class="mainPanel" :style="(currentPanel == 'Denied')? 'display:flex': 'display:none;'">
      <div v-for="song in declined" class="songPanel" style="width: fit-content; height: fit-content; padding: 10px 20px;">
        <iframe style="border-radius:12px; position: relative; margin-top: 10px;left: 50%; transform: translateX(-50%);" 
        :src= getSpotifyEmbed(song)
        width="250" height="152" frameBorder="0" allowfullscreen="" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"></iframe>
      </div>
    </div>
    
    <div id="bottomNav">
      <div class="clickable" :class="(currentPanel == 'Pending') ? 'activeNavPanel' : 'navPanel'" @click="currentPanel = 'Pending'">Pending</div>
      <div class="clickable" :class="(currentPanel == 'Accepted') ? 'activeNavPanel' : 'navPanel'" @click="currentPanel = 'Accepted'">Accepted</div>
      <div class="clickable" :class="(currentPanel == 'Denied') ? 'activeNavPanel' : 'navPanel'" @click="currentPanel = 'Denied'">Denied</div>
    </div>
</template>

<style scoped>
    .inputField{
        background-color: transparent;
        border: 1px solid white;
        border-radius: 4px;
    }
    .inputBtn{
        background-color: transparent;
        border: 1px solid white;
        border-radius: 4px;
    }

    .mainPanel{
      width: 90%;
      height: fit-content;
      max-height: 85vh;
      margin-left: 5%;
      

      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      flex-wrap: wrap;

      scroll-behavior: smooth;
      overflow: auto;
    }
    

    .songPanel{
      width: fit-content;
      height: fit-content;
      
      background-color: rgb(99, 99, 99);
      border-radius: 12px;
      position: relative;

      padding: 10px 20px 5px 20px;
      margin: 35px 5% 10px 5%;
    }

    .buttonWrapper{
      width: 100%;
      height: 30px;

      display: flex;
      flex-direction: row;

      justify-content: space-around;
      align-items: center;

      margin-top: 5px;
    }

    .buttonWrapper button{
      width: 30%;
      height: 25px;
      background-color: transparent;
      border: 3px solid white;
      border-radius: 6px;
      font-size: 1rem;
    }

    .grayedOutVoteBtn{
      color: gray;
      border-color: gray;
    }

    #bottomNav{
      width: 100%;
      height: 45px;
      

      position: absolute;
      bottom: 10px;

      display: flex;
      justify-content: space-around;
      align-items: center;

      flex-direction: row;
    }

    .navPanel{
      width: 30%;
      height: 100%;
      font-size: 2rem;
      text-align: center;
      border-radius: 20px;
      border: 1px solid white;
      margin-bottom: 5px;
    }
    
    .activeNavPanel{
      width: 30%;
      height: 100%;
      font-size: 2rem;
      text-align: center;
      border-radius: 20px;
      border: 1px solid rgb(20, 218, 20);
      margin-bottom: 5px;
      color: rgb(20, 218, 20);
    }
</style>