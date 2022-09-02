<script lang="ts">
	import OnlineFriends from '$lib/chat/OnlineFriends.svelte';
	import ConversationLists from '$lib/chat/ConversationLists.svelte';
	import CreateChannelButton from '$lib/chat/buttons/CreateChannelButton.svelte';
	import SendNewMessageButton from '$lib/chat/buttons/SendNewMessageButton.svelte';
	import JoinChannelButton from '$lib/chat/buttons/JoinChannelButton.svelte';
	import { myself } from '$lib/state';
</script>

<div id="chat">
	<div id="title">
		<h1>Chat</h1>
		<div id="options">
			<CreateChannelButton />
			<JoinChannelButton />
			<SendNewMessageButton>
				<img id="btn-new-message" src="pencil.png" width="40" height="40" alt="write msg" />
			</SendNewMessageButton>
		</div>
	</div>

	<div id="mainContainer">
		<OnlineFriends friends={$myself.friendlist} />
		<br />
		<ConversationLists />
	</div>
</div>

<style>
	* {
		font-family: 'Press Start 2P';
	}

	#chat {
		width: 100%;
		height: 100%;
		background-image: url('/starsSky.png');
		background-size: cover;
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
		line-height: 300%;
		-webkit-text-stroke: 2px #00bfff;
		font-size: 3em;
	}
	#btn-new-message {
		float: right;
	}
</style>
