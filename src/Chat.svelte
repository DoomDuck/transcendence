<script lang="ts">

	import { createEventDispatcher } from 'svelte';
	import ChatConversation from './ChatConversation.svelte';
	import OnlineFriends from './OnlineFriends.svelte';
	import WriteNewMsg from './NewChatMessage.svelte';

	const dispatch = createEventDispatcher();

	let profilePic = "../src/img/canard.jpeg" ;
	let friends = [];

</script>

<div id="chat">
	<div id="title"> 
		<h1 on:click="{() => dispatch("open_menu")}">
			Chat
		</h1>
		<WriteNewMsg/>
	</div>

	<input class="champ" type="search" value="Search.." > <br> <br> <br>

	<OnlineFriends onlineFriends={friends}/>

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

.champ {
	height: 40px;
	width: 95%;
	font-size: 0.5%;
	color: white;
	background-color: #D9D9D9;
	margin-right: 2%;
	margin-left: 2%;
}

</style>