<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
</script>

<div id="start_a_game">
  <div id="game">
    <h4 on:click={() => dispatch("Play")}>Play</h4>
    <h4 on:click={() => dispatch("Watch_a_game")}>Watch a game</h4>
    <h4 on:click={() => dispatch("see_friends")}>Challenge a friend</h4>
  </div>
  <img
    on:click={() => dispatch("open_menu")}
    src="img/return.png"
    alt="return"
    width="30"
    height="30"
  />
</div>

<style>
  #start_a_game {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    width: 100%;
    height: 100%;
    /* background-color: #ea0ed4; */
    background-image: url("starsSky.jpeg");
  }

  #game {
    display: flex;
    flex-direction: column;
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
    color: #6028ff;
    line-height: 300%;
    -webkit-text-stroke: 1px #ff29ea;
    text-shadow: 5px 5px 5px purple, 5px 5px 5px purple;
    font-size: 3.5vh;
  }

  h4:hover {
    background-color: blue;
    width: 100%;
    text-align: center;
  }
</style>
