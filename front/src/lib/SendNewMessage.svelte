<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let text: string;

	const dispach = createEventDispatcher();
	let target: string = '';
</script>

<form on:submit|preventDefault={() => dispach('msgToUser', { target, text })}>
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
		<button>
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
