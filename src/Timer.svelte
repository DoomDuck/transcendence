<script>
import { onDestroy } from 'svelte';
import { fade } from 'svelte/transition';

let start = new Date();
let now = start;
let interval_id = null;

let duration;
$: duration = Math.floor((now - start) / 1000);
let h;
$: h = Math.floor(duration / 3600);
let m;
$: m = Math.floor(duration / 60) % 60;
let s;
$: s = Math.floor(duration % 60);

function start_timer() {
  start = new Date()
  now = start; 

  interval_id = setInterval(() => {
    now = new Date()
  }, 1000);
}

function stop_timer() {
  if (!interval_id) return;
  clearInterval(interval_id);
  interval_id = null;
}

function reset_timer() {
  stop_timer();
  start = now;
}

onDestroy(stop_timer);

</script>

<div id=container>

<div id=time>
<div>{h}</div>
<div>{m}</div>
<div>{s}</div>
</div>

<div id=buttons>
{#if !interval_id}
<button on:click={start_timer}> START </button>
{:else}
<button on:click={stop_timer}> STOP </button>
{/if}
<button on:click={reset_timer}> RESET </button>
</div>

</div>

<style>

#container {
  background-color: #a0a0a0;
  border-radius: 5px;
  padding: 0.7em;
}

#time {
  display: flex;
  justify-content: space-around;
}

#time > div {
  font-size: 3em;
  margin: 0.2em;
  padding: 0.1em;
  border-radius: 5px;
  background-color: #c0c0c0;
}

#buttons {
  font-size: 2em;
  margin: 0.2em;
  display: flex;
  justify-content: space-around;
}

button {
  width: 4em;
}

</style>
