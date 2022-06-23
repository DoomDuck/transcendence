<script lang="ts">

import {onMount} from 'svelte';

import {ClientContext} from "../pong/client/client";

onMount(() => {
    const ctx = new ClientContext();
})

</script>

<style>
#game-container {
    width: 100%;
    height: 100%;
}
/* ensuring that game text and game screen superpose */
#game-text {
    position: absolute;
    top: 0;
    z-index: 1;
}
/* ensuring that game text and game screen superpose */
#game-screen {
    position: absolute;
    top: 0;
    z-index: 0;
}
.player-score {
    color: rgb(255, 255, 255);
    font-family: sans-serif;
    background: rgba(0, 0, 0, 0);
}
</style>

<div id="game-container">
    <div id="game-screen"></div>
    <div id="game-text">
        <div id="p1-score" class="player-score"></div>
        <div id="p2-score" class="player-score"></div>
    </div>
</div>
