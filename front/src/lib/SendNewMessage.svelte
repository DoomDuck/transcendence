<script lang="ts">
	export let sendMessage: (interlocutor: string, text: string) => void;
	export let text: string;
	let target: string = '';
</script>

<form on:submit|preventDefault={() => sendMessage(target, text)}>
	<div id="formContainer">
		<input
			id="destinataire"
			type="search"
			placeholder="To :"
			contenteditable="true"
			bind:value={target}
			required
		/> <br />
		<textarea id="message" type="text" placeholder="Type a message..." bind:value={text} />
		<!-- input go in newText -->
		<button on:click={() => sendMessage(target, text)}>
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
