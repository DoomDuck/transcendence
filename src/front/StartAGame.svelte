<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
</script>

<div id="start_a_game">
  <div id="game">
    <h4 on:click={() => dispatch("Play")}>Play</h4>
    <h4 on:click={() => dispatch("see_friends")}>Challenge a friend</h4>
  </div>
  <img on:click={() => dispatch("open_menu")} src="img/return.png" alt="return" width="30" height="30"/>
</div>

<style>
  #start_a_game {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    width: 100%;
    height: 100%;
    background-color: #ea0ed4;
    
  }
  #game{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  img {
    float: left;
    margin-left: 3%;
    margin-bottom: 3%;
  }

  h4 {
    text-align: center;
    font-family: "Press start 2P";
    font-style: normal;
    color: blue;
    line-height: 500%;
    -webkit-text-stroke: 1px #000000;
    font-size: 3em;
  }

  h4:hover {
    background-color: purple;
    background-size: 100%;
  }
</style>