<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let color: string = "#6028FF";

  const dispatch = createEventDispatcher();
</script>

<div id="menu">
  <div id="menuContainer">
    <h1 class="typography" style="color: {color}">Transcendence</h1>
    <h4
      class="typography"
      style="color: {color}"
      on:click={() => dispatch("start_game")}
    >
      Game
    </h4>
    <h4
      class="typography"
      style="color: {color}"
      on:click={() => dispatch("open_chat")}
    >
      Chat
    </h4>
    <h4
      class="typography"
      style="color: {color}"
      on:click={() => dispatch("open_paremeters")}
    >
      Parameters
    </h4>
  </div>
</div>

<style>
  #menu {
    background-image: url("starsSky.jpeg");
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  #menuContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }

  .typography {
    font-family: "Press Start 2P";
    font-style: normal;
  }

  h1 {
    line-height: 300%;
    -webkit-text-stroke: 2px #ff29ea;
    text-shadow: 6px 6px 6px purple, 6px 6px 6px purple;
    font-size: 6vh;
  }

  h4 {
    line-height: 350%;
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
