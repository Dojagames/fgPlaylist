<script>
export default {

  data(){
    return {
      pwInput: "",
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
  <div id="wrapper">
    <input placeholder="password" v-model="pwInput" @keyup.enter="this.$parent.checkPw(pwInput)">
    <button @click="this.$parent.checkPw(pwInput)">Login</button>
  </div>
</template>

<style scoped>
  #wrapper{
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