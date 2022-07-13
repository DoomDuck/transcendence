<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
</script>

<div id="Play">
  <img
    on:click={() => dispatch("start_game")}
    src="img/return.png"
    id="return"
    alt="return"
    width="30"
    height="30"
  />
</div>

<style>
  #Play {
    width: 100%;
    height: 100%;
    background-image: url("../../public/img/starsSky.jpeg");
    overflow: hidden;
  }
  img {
    float: right;
    margin-right: 7%;
    margin-top: 3%;
  }
  #return {
    float: left;
    margin-left: 3%;
  }
</style>
