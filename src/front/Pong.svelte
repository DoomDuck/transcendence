<script lang="ts">
import {ClientContext} from "../pong/client/client.ts";

setup();

</script>

<div class="launch">
    <button id="launch-0">P1</button>
    <button id="launch-1">P2</button>
    <button id="launch-2">Spectator</button>
</div>

<style>

body {
    overflow: hidden;
    margin: 0px;
}
canvas {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translateX(-50%);
}

.game-text {
    position: absolute;
    top: 0px;
}

.player-score {
    color: #FFF;
    font-family: sans-serif;
    background: rgba(0, 0, 0, 0);
}

</style>
