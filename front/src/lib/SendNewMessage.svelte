<script lang="ts">
	export let sendMessage: (text: string) => void;
	export let newText: string;
</script>

<form on:submit|preventDefault={() => sendMessage(newText)}>
	<div id="formContainer">
		<input id="destinataire" type="search" placeholder="To :" required /> <br />
		<textarea id="message" type="text" placeholder="Type a message..." bind:value={newText} />
		<!-- input go in newText -->
		<button on:click={() => sendMessage(newText)}>
			<img src="send.png" alt="send message" />
		</button>
	</div>
</form>

<style>
	#formContainer {
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

	img {
		width: 2em;
		height: 2em;
	}
	textarea {
		resize: none;
	}
</style>
