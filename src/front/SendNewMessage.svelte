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

<input class="destinataire" type="search" value="to :" required />
<br />
<br />
<textarea class="message" rows="50" cols="80" />
<br />
<img src="img/send.png" alt="send" width="30" height="30" />

<style>
  .destinataire {
    width: 70%;
    height: 5%;
    font-size: 0.5%;
    color: white;
    background-color: #d9d9d9;
  }

  .message {
    width: 70%;
    font-size: 0.5%;
    color: white;
    background-color: #d9d9d9;
    size: 800;
  }

  textarea {
    resize: none;
  }
</style>
