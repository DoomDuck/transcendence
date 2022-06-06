<script lang="ts">

import {ClientContext} from "../pong/client/client";
const ctx = new ClientContext();
// console.log(document.getElementById("launch-0"));
// document.getElementById("launch-0")?.addEventListener("click", () => console.log('1'));
// document.getElementById("launch-1")?.addEventListener("click", () => console.log('2'));
// document.getElementById("launch-2")?.addEventListener("click", () => console.log('3'));
// // document.getElementById("launch-0")?.addEventListener("click", () => ctx.socket?.emit("playerIdSelect", 0));
// // document.getElementById("launch-1")?.addEventListener("click", () => ctx.socket?.emit("playerIdSelect", 1));
// // document.getElementById("launch-2")?.addEventListener("click", () => ctx.socket?.emit("playerIdSelect", 2));


</script>

<div class="launch">
    <button id="launch-0" on:click="{() => ctx.select(0)}">P1</button>
    <button id="launch-1" on:click="{() => ctx.select(1)}">P2</button>
    <button id="launch-2" on:click="{() => ctx.select(2)}">Spectator</button>
</div>
