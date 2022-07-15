<script lang="ts">
  import { onMount } from "svelte";

  import { ClientContext } from "../pong/client/client";

  onMount(() => {
    const ctx = new ClientContext();
  });
</script>

<style>
#game-full {
    display: flex;
    align-items: center;
    justify-content: center;
    width:70%;
    height:70%;
    background-image: url("../../public/img/fond_ecran_jeu.png");
}
#game-container {
    width:90%;
    height:90%;
    display: flex;
    align-items: center;
    justify-content: center;
}
#game-screen {
    border: 1px solid white;
}
/* .player-score {
    color: rgb(255, 255, 255);
    font-family: sans-serif;
    background: rgba(0, 0, 0, 0);
} */
</style>
<div id="game-full">
    <div id="game-container">
        <canvas id="game-screen"></canvas>
    </div>
</div>
