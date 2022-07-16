<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "./Modal.svelte";

  const dispatch = createEventDispatcher();

  let isOpenModal = false;

  export let image = "img/canard.jpeg";
  export let friendName = "Joey";

  function openModal() {
    isOpenModal = true;
  }

  function closeModal() {
    isOpenModal = false;
  }
</script>

<img class="roundedImageProfile" src={image} alt="profilepic" />
<br />
<h1>{friendName}</h1>

<style>
  h1 {
    color: #ff00b8;
    font-size: 0.7em;
    text-align: center;
  }
  .roundedImageProfile {
    overflow: hidden;
    -webkit-border-radius: 50px;
    -moz-border-radius: 50px;
    border-radius: 30px;
    width: 60px;
    height: 60px;
    margin-top: 2%;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
</style>
