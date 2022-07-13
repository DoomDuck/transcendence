<script lang="ts">

	import { createEventDispatcher } from 'svelte';
	import ChatConversation from './ChatConversation.svelte';

	const dispatch = createEventDispatcher();

	function newMessage(){
		alert('New Message')
	}

	let profilePic = "../src/img/canard.jpeg" ;
	let onlineFriends = [];

</script>

<div id="chat">
	<div id="title"> 
		<h1 on:click="{() => dispatch("open_menu")}">
			Chat
		</h1>
		<a href="#demo"> 
			<img src=../src/img/write.png width="40" height="40" alt="write msg"/>
		</a>
		<div id="demo" class="modal">
			<div class="modal_content">
				<input class='destinataire' type='search' value="to :" required />
				<br><br>
				<textarea class="message" rows="50" cols="80"> </textarea>
				<br>
				<img src=../src/img/send.png alt="send" width='30' height='30'/>
				<a href='#' class="modal_close">&times;</a>
			</div>
		</div>
	</div>

	<input class="champ" type="search" value="Search.." > <br> <br> <br>
	<div id="online"> <br> Online friends </div>
	<div id="onlineFriends">
		{#each onlineFriends as friend}
		<img class="roundedImage" src={friend.profilePic} alt="contact"/>
		{/each}
	</div>
	<br>

	<ChatConversation/>
	<ChatConversation name="Joey" image="../src/img/canard.jpeg" has_new_message={true}/>


</div>

<style>

* {
	font-family: 'Press Start 2P';
}

#chat {
	width: 100%;
	height: 100%;
	background-color: #4628FF;
	overflow: hidden;
	display:flex;
	flex-direction: column;
}

#title {
	display:flex;
	justify-content: space-between;
	align-items: center;
	padding-left: 5%;
	padding-right: 5%;
}
	
h1 {
	justify-content: left;
	font-style: normal;
	color: #FF00B8;
	line-height: 150%;
	-webkit-text-stroke: 2px #ECF100;
	font-size:2.5em;
}


img {
	display: inline-block;
	float: right;
	justify-content: right;
}

textarea {
   resize: none;
}

.modal {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: 0; right: 0;
  bottom: 0; left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(77, 77, 77, .7);
  transition: all .4s;
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
	background-color: #D9D9D9;
}

.message {
	width: 70%;
	font-size: 0.5%;
	color: white;
	background-color: #D9D9D9;
	size: 800;
}

.champ {
	height: 40px;
	width: 95%;
	font-size: 0.5%;
	color: white;
	background-color: #D9D9D9;
	margin-right: 2%;
	margin-left: 2%;
}


#onlineFriends {
	width: 95%;
	height:8%;
	background: white;
	display: flex;
	flex-wrap: nowrap;
	overflow-x: auto;
	margin-left: 2%;
}

#online {
	color: white;
	width:95%;
	height:3%;
	background: #FF00B8;
	margin-left: 2%;
}

.roundedImage {
	overflow:hidden; 
	-webkit-border-radius:50px;
	-moz-border-radius:50px;
	border-radius:50px;
	width:90px;
	height:90px;
	margin-left: 2%;
	margin-right: 1%;
	margin-top: auto;
    margin-bottom: auto;
	flex: 0 0 auto;
}


</style>