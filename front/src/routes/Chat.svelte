<script lang="ts">
	import DirectMessages from '$lib/DirectMessages.svelte';
	import OnlineFriends from '$lib/OnlineFriends.svelte';
	import WriteNewMsg from '$lib/WriteNewMsg.svelte';
	import CreateChannel from '$lib/CreateChannel.svelte';
	import OpenConversations from '$lib/OpenConversations.svelte';

	let friends = [
		{ profilePic: 'cars.jpeg', name: 'coullax' },
		{ profilePic: 'canard.jpeg', name: 'coullax' }
	];
</script>

<div id="chat">
	<div id="title">
		<h1>Chat</h1>
		<div id="options">
			<CreateChannel />
			<WriteNewMsg />
		</div>
	</div>

	<div id="mainContainer">
		<input class="champ" type="search" placeholder="Search.." />

		<OnlineFriends onlineFriends={friends} />
		<div>
			<DirectMessages name="Flash McQueen" image="cars.jpeg" hasNewMessage={true} />

			<DirectMessages name="Joey" image="canard.jpeg" hasNewMessage={true} />
		</div>
		<OpenConversations />
	</div>
</div>

<style>
	* {
		font-family: 'Press Start 2P';
	}

	#chat {
		width: 100%;
		height: 100%;
		background-image: url('/starsSky.jpeg');
		overflow: hidden;
		display: flex;
		flex-direction: column;
		overflow-y: scroll;
	}

	#title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-left: 10vw;
		margin-right: 10vw;
	}

	#options {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 20px;
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
		color: #fa1ec7;
		line-height: 150%;
		-webkit-text-stroke: 2px #00bfff;
		font-size: 2.5em;
	}

	.champ {
		height: 40px;
		width: 80vw;
		font-size: 0.5%;
		color: white;
		background-color: #d9d9d9;
		margin-right: 2%;
		margin-left: 2%;
	}
</style>
