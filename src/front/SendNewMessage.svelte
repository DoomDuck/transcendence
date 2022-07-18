<script lang='ts'>
  export let sendMessage;
  export let newText : string;
</script>

<form on:submit|preventDefault={sendMessage}>
  <div id="formContainer">
    <input
      id="destinataire"
      type="search"
      placeholder="To :"
      required/> <br/>
    <textarea
      id="message"
      type="text"
      placeholder="Type a message..."
      bind:value={newText} /> <!-- input go in newText -->
      <button>
      <img src="img/send.png" alt="send message"/>
    </button>
  </div>
</form>

<style>
  #formContainer{
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  #destinataire {
    width: 100%;
    height: 5em;
  }

  #message {
    width: 100%;
    height: 5em;
  }

  img{
    width: 2em;
    height: 2em;

  }
  textarea {
    resize: none;
  }

</style>