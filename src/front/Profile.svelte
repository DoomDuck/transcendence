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
    font-size: 1em;
    text-align: center;
  }
  .roundedImageProfile {
    overflow: hidden;
    border-radius: 6em;
    width: 8em;
    height: 8em;
    margin-top: 2%;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
</style>
