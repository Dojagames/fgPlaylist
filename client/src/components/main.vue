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
    
  },
  methods: {

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
        <button class="inputBtn" @click="this.$parent.AddSong(inputLink)">Add</button>
    </div>
  <div class="track">
    <iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/3BkmYdoeJaP21ai2e9pbRM?utm_source=generator" width="250" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
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