<script lang="ts">
</script>

<a href="#demo">
  <img src="img/write.png" width="40" height="40" alt="write msg" />
</a>
<div id="demo" class="modal">
  <div class="modal_content">
    <input class="destinataire" type="search" value="to :" required />
    <br /><br />
    <textarea class="message" rows="50" cols="80" />
    <br />
    <img src="img/send.png" alt="send" width="30" height="30" />
    <a href="#" class="modal_close">&times;</a>
  </div>
</div>

<style>
  .modal {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(77, 77, 77, 0.7);
    transition: all 0.4s;
  }

  .modal:target {
    visibility: visible;
    opacity: 1;
  }

  .modal_content {
    border-radius: 4px;
    position: relative;
    width: 40%;
    height: 40%;
    background: white;
    padding: 1.5em 2em;
  }

  .modal_close {
    position: absolute;
    top: 10px;
    right: 10px;
    color: grey;
    text-decoration: none;
  }

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

  img {
    display: inline-block;
    float: right;
    justify-content: right;
  }
</style>
