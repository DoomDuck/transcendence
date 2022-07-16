<script>
  import { createEventDispatcher } from "svelte";
  import Profile from "./Profile.svelte";
  import SendMessage from "./SendNewMessage.svelte";

  const dispatch = createEventDispatcher();

  export let type = "Profile";
  export let isOpenModal;
  export let friendName = "";

  export let image = "";

  function closeModal() {
    isOpenModal = false;
    dispatch("closeModal", { isOpenModal });
  }
</script>

<div
  id="background"
  style="--display: {isOpenModal ? 'block' : 'none'};"
  on:click={closeModal}
/>
<div id="modal" style="--display: {isOpenModal ? 'block' : 'none'};">
  <p>{type}</p>
  <p>{type}</p>
  <p>{type}</p>
  {#if { type } == "Profile"}
    <Profile {image} {friendName} />
  {:else if { type } == "SendMessage"}
    <SendMessage />
  {/if}
</div>

<style>
  #background {
    display: var(--display);
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }

  #modal {
    display: var(--display);
    position: fixed;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    filter: drop-shadow(0 0 20px #333);
  }
</style>
