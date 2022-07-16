<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "./Modal.svelte";

  const dispatch = createEventDispatcher();

  let isOpenModal = false;

  function openModal() {
    isOpenModal = true;
  }

  function closeModal() {
    isOpenModal = false;
  }
</script>

<img
  src="img/write.png"
  width="40"
  height="40"
  alt="write msg"
  on:click={openModal}
/>
<Modal {isOpenModal} type="SendMessage" on:closeModal={closeModal} />

<style>
  img {
    display: inline-block;
    float: right;
    justify-content: right;
  }
</style>
