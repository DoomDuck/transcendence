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
#game-screen {
    /* position: absolute;
    top: 0;
    z-index: 0; */
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
