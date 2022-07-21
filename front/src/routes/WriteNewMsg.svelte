<script>
  import { createEventDispatcher } from "svelte";
  import SendMessage from "./SendNewMessage.svelte";
  import Modal from "./Modal.svelte";

  const dispatch = createEventDispatcher();

  let sendingMessage = false;
</script>

<img
  src="write.png"
  width="40"
  height="40"
  alt="write msg"
  on:click={() => (sendingMessage = true)}
/>

{#if sendingMessage}
  <Modal on:close={() => (sendingMessage = false)}>
    <SendMessage />
  </Modal>
{/if}

<style>
  img {
    display: inline-block;
    float: right;
    justify-content: right;
  }
</style>
