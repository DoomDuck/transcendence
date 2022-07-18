<script lang="ts">
  export let image: string;
  export let friendName: string;
</script>

<img class="roundedImageProfile" src={image} alt="profilepic" />
<br />
<h1>{friendName}</h1>

<style>
  h1 {
    color: #ff00b8;
    font-size: 0.7em;
    text-align: center;
  }
  .roundedImageProfile {
    overflow: hidden;
    -webkit-border-radius: 50px;
    -moz-border-radius: 50px;
    border-radius: 30px;
    width: 60px;
    height: 60px;
    margin-top: 2%;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
</style>
