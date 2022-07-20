<script lang="ts">
  import { onMount } from "svelte";
  import {
    ClientGameContextOffline,
    ClientGameContextOnline,
  } from "../pong/client";

  onMount(() => {
    // offline
    const ctx = new ClientGameContextOffline();
    ctx.startGame();
    // online
    // const ctx = new ClientGameContextOnline();
    // ctx.connect();
    // ctx.startGame();
  });
</script>

<div id="game-container">
  <canvas id="game-screen" />
</div>

<style>
  #game-container {
    width: 67%;
    height: 67%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #game-screen {
  }
  /* .player-score {
    color: rgb(255, 255, 255);
    font-family: sans-serif;
    background: rgba(0, 0, 0, 0);
} */
</style>
