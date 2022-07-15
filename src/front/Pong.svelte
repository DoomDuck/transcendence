<script lang="ts">

import {onMount} from 'svelte';

import {ClientGameContext} from "../pong/client";

onMount(() => {
    // offline
    // const ctx = new ClientGameContext(false);
    // ctx.startGame();
    // online

    this.socket = io('http://localhost:5000/pong');
    this.socket.on("connect", () => {
        console.log("connected to server");
    });
    this.socket.on("disconnect", ()=> {
        console.log("disconnected from server");
    });
    const ctx = new ClientGameContext(true);
    ctx.configureSocket(socket)
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
