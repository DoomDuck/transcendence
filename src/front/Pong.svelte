<script lang="ts">

import { onMount } from "svelte";
import {ClientGameContextOffline, ClientGameContextOnline} from "../pong/client";

onMount(() => {
    // offline
    const ctx = new ClientGameContextOffline();
    ctx.startGame();
    // online
    // const ctx = new ClientGameContextOnline();
    // ctx.connect();
    // ctx.startGame();
})

</script>

<style>

#game-container {
    width:67%;
    height:67%;
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
<div id="game-container">
    <canvas id="game-screen"></canvas>
</div>
