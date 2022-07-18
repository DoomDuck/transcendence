<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import ChatConversation from "./ChatConversation.svelte";
  import OnlineFriends from "./OnlineFriends.svelte";
  import WriteNewMsg from "./NewChatMessage.svelte";

  const dispatch = createEventDispatcher();

  let profilePic = "img/canard.jpeg";
  let friends = [];
</script>

<div id="chat">
  <div id="title">
    <h1 on:click={() => dispatch("open_menu")}>Chat</h1>
    <WriteNewMsg />
  </div>

  <input class="champ" type="search" value="Search.." /> <br /> <br /> <br />

  <OnlineFriends onlineFriends={friends} />

  <ChatConversation
    friendName="Flash McQueen"
    image="img/cars.jpeg"
    has_new_message={true}
  />

  <ChatConversation
    friendName="Joey"
    image="img/canard.jpeg"
    has_new_message={true}
  />
</div>

<style>
  * {
    font-family: "Press Start 2P";
  }

  #chat {
    width: 100%;
    height: 100%;
    background-color: #4628ff;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  #title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5%;
    padding-right: 5%;
  }

  h1 {
    justify-content: left;
    font-style: normal;
    color: #ff00b8;
    line-height: 150%;
    -webkit-text-stroke: 2px #ecf100;
    font-size: 2.5em;
  }

  .champ {
    height: 40px;
    width: 95%;
    font-size: 0.5%;
    color: white;
    background-color: #d9d9d9;
    margin-right: 2%;
    margin-left: 2%;
  }
</style>
