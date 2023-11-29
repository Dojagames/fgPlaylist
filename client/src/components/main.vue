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
    }
  },
  components: {
    
  },
  props: {
    playlist: Array,
  },
  methods: {
    getSpotifyEmbed(link){
      return "https://open.spotify.com/embed/track/" + link +"?utm_source=generator "
    }
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
      :src= getSpotifyEmbed(song)
      width="250" height="152" frameBorder="0" allowfullscreen="" 
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
      loading="lazy"></iframe><br>
      <div class="buttonWrapper">
        <button style="border-color: rgb(20, 218, 20); color: rgb(20, 218, 20);" @click="this.$parent.setVote(song, true)">Yes</button>
        <button style="border-color: rgb(236, 97, 4); color: rgb(236, 97, 4);" @click="this.$parent.setVote(song, false)">No</button>
      </div>
      
    </div>
  <div class="track">
    
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

    .buttonWrapper button:hover{
      cursor: pointer;
    }
</style>