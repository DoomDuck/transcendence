<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function newMessage() {
    alert("New Message");
  }
</script>

<div class="waitingRoom">
  <img src="img/matchPong.gif" alt="waitingPong" width="30%" height="20%" />
</div>

<style>
  img {
    text-align: center;
    margin: auto;
  }
  .waitingRoom {
    background-image: url("starsSky.jpeg");
    display: flex;
    width: 100%;
    height: 100%;
  }
</style>
