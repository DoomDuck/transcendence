<script lang="ts">
  import { onDestroy } from "svelte";

  let start = new Date();
  let now: Date = start;
  let interval_id = null;

  let duration: number;
  $: duration = Math.floor((now.getTime() - start.getTime()) / 1000);
  let h: number, m: number, s: number;
  $: h = Math.floor(duration / 3600);
  $: m = Math.floor(duration / 60) % 60;
  $: s = Math.floor(duration % 60);

  function start_timer() {
    start = new Date();
    now = start;

    interval_id = setInterval(() => {
      now = new Date();
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

<div id="container">
  <div id="time">
    <div>{h}</div>
    <div>{m}</div>
    <div>{s}</div>
  </div>

  <div id="buttons">
    {#if !interval_id}
      <div style="background-color: olive;" on:click={start_timer}>START</div>
    {:else}
      <div style="background-color: darkcyan" on:click={stop_timer}>STOP</div>
    {/if}
    <div style="background-color: brown;" on:click={reset_timer}>RESET</div>
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
    display: flex;
    justify-content: space-around;
  }

  #buttons > div {
    font-size: 1em;
    font-weight: bold;
    margin: 0.2em;
    padding: 0.2em;
    border-radius: 3px;
    background-color: #c0c0c0;
  }
</style>
