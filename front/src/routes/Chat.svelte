<script lang="ts">
	import ChatConversation from '$lib/ChatConversation.svelte';
	import OnlineFriends from '$lib/OnlineFriends.svelte';
	import WriteNewMsg from '$lib/WriteNewMsg.svelte';

	let friends = [{ profilePic: 'cars.jpeg' }, { profilePic: 'canard.jpeg' }];
</script>

<div id="chat">
	<div id="title">
		<h1>Chat</h1>
		<WriteNewMsg />
	</div>

	<div id="mainContainer">
		<input class="champ" type="search" value="Search.." />

		<OnlineFriends onlineFriends={friends} />
		<div>
			<ChatConversation friendName="Flash McQueen" image="cars.jpeg" has_new_message={true} />

			<ChatConversation friendName="Joey" image="canard.jpeg" has_new_message={true} />
		</div>
	</div>
</div>

<style>
	* {
		font-family: 'Press Start 2P';
	}

	#chat {
		width: 100%;
		height: 100%;
		background-color: #4628ff;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		overflow-y: scroll;
	}

	#title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 5%;
		padding-right: 5%;
	}

	#mainContainer {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
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
