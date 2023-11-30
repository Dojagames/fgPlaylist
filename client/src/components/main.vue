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


  },
  created() {
    
  },
  mounted(){
    
  },
  watch: {
    
  },

}
</script>

<template>
    <div id="add">
        <input placeholder="spotify link" class="inputField" v-model="inputLink">
        <button class="inputBtn" @click="this.$parent.AddSong(inputLink); inputLink = ''">Add</button>
    </div>
    <div v-for="song in playlist" class="songPanel"><iframe style="border-radius:12px; position: relative; margin-top: 10px;left: 50%; transform: translateX(-50%);" 
      :src= getSpotifyEmbed(song.url)
      width="250" height="152" frameBorder="0" allowfullscreen="" 
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
      loading="lazy"></iframe><br>

      <div class="buttonWrapper" v-if="getSongVote(song.url) == 'yes'">
        <button style="border-color: rgb(96, 179, 103); color: rgb(96, 179, 103);">Yes</button>
        <button style="border-color: rgb(63, 63, 63); color: rgb(63, 63, 63);" @click="this.$parent.changeVote(song.url, false)">No</button>
      </div>
      <div class="buttonWrapper" v-else-if="getSongVote(song.url) == 'no'">
        <button style="border-color: rgb(63, 63, 63); color: rgb(63, 63, 63);" @click="this.$parent.changeVote(song.url, true)">Yes</button>
        <button style="border-color: rgb(163, 108, 97); color: rgb(163, 108, 97);">No</button>
      </div>
      <div class="buttonWrapper" v-else>
        <button style="border-color: rgb(20, 218, 20); color: rgb(20, 218, 20);" @click="this.$parent.setVote(song.url, true)">Yes</button>
        <button style="border-color: rgb(236, 97, 4); color: rgb(236, 97, 4);" @click="this.$parent.setVote(song.url, false)">No</button>
      </div>

    </div>
    <div id="bottomNav">
      <div :class="(currentPanel == 'Pending') ? 'activeNavPanel' : 'navPanel'">Pending</div>
      <div :class="(currentPanel == 'Accepted') ? 'activeNavPanel' : 'navPanel'">Accepted</div>
      <div :class="(currentPanel == 'Denied') ? 'activeNavPanel' : 'navPanel'">Denied</div>
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

    .songPanel{
      width: 300px;
      height: 200px;
      
      background-color: rgb(99, 99, 99);
      border-radius: 12px;
      position: relative;

      margin: 10px;
    }

    .buttonWrapper{
      width: 100%;
      height: 30px;

      display: flex;
      flex-direction: row;

      justify-content: space-around;
      align-items: center;
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

    .buttonWrapper button:hover{
      cursor: pointer;
    }

    #bottomNav{
      width: 100%;
      height: 45px;
      

      position: absolute;
      bottom: 0;

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