<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Profile from "./Profile.svelte";
  import Modal from "./Modal.svelte";

  const dispatch = createEventDispatcher();

  let showProfile = false;

  export let image: string;
  export let friendName: string;
</script>

<div class="friend">
  <img
    class="roundedImageFriend"
    src={image}
    alt="profilePic"
    on:click={() => (showProfile = true)}
  />
  {#if showProfile}
    <Modal on:close={() => (showProfile = false)}>
      <Profile {image} {friendName} />
    </Modal>
  {/if}

  <p class='name'> {friendName} </p>
  <img
    on:click={() => dispatch("start_waiting")}
    class="play"
    src="img/console.png"
    alt="play"
    width="50"
    height="50"
  />
</div>

<style>
  .friend {
    width: 94%;
    height: 6%;
    background: white;
    display: flex;
    align-items: center;
    border: 1px solid #ff00b8;
  }

  .play {
    margin-left: auto;
    padding: 5%;
  }

  .roundedImageFriend {
    overflow: hidden;
    -webkit-border-radius: 50px;
    -moz-border-radius: 50px;
    border-radius: 30px;
    width: 50px;
    height: 50px;
    margin-left: 1%;
    margin-right: 10%;
    margin-top: auto;
    margin-bottom: auto;
  }

  .name {
    color: #ff00b8;
  }
</style>
