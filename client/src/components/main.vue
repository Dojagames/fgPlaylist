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
    <div v-for="song in playlist"><iframe style="border-radius:12px" 
      :src= getSpotifyEmbed(song)
      width="250" height="152" frameBorder="0" allowfullscreen="" 
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
      loading="lazy"></iframe>
      <button>Yes</button>
      <button>No</button>
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
</style>