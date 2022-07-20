<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Friend from "./Friend.svelte";

  export let friendNameSearch;
  const dispatch = createEventDispatcher();
</script>

<div class="friendsList">
  <div id="mainContainer">
    <h1>Friends List</h1>
    <form on:submit|preventDefault={friendNameSearch}>
      <input type="search" placeholder="search..." />
    </form>
    <div>
      <Friend friendName="Flash McQueen" image="img/cars.jpeg" />
      <Friend friendName="Joey" image="img/canard.jpeg" />
    </div>
    <img
      on:click={() => dispatch("start_game")}
      src="img/return.png"
      alt="return"
      width="30"
      height="30"
    />
  </div>
</div>

<style>
  * {
    font-family: "Press Start 2P";
  }
  #mainContainer {
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
    gap: 20px;
    width: 100vw;
    height: 100vh;
  }

  h1 {
    color: #d0c5ff;
    -webkit-text-stroke: 2px white;
    font-size: 3em;
    line-height: 300%;
    text-align: center;
  }

  input {
    height: 40px;
    width: 95vw;
    color: white;
    background-color: aliceblue;
  }

  .friendsList {
    background-color: #9584ff;
    width: 100%;
    height: 100%;
  }
</style>
