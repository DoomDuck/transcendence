<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import { sendDirectMessage } from '$lib/state';
	import PositiveIntegerInput from '../PositiveIntegerInput.svelte';

	export let content = '';
	export let show = false;
	let targetStr = '';

	function handleSubmit() {
		sendDirectMessage({ target: +targetStr, content });
		close();
		return true;
	}

	function close() {
		content = '';
		show = false;
		targetStr = '';
	}
</script>

<Modal bind:show on:close={close}>
	<form id="formContainer" on:submit|preventDefault={handleSubmit}>
		<div id="destinataire">
			<PositiveIntegerInput placeholder="To :" bind:content={targetStr} />
		</div>
		<br />
		<textarea id="message" type="text" placeholder="Type a message..." bind:value={content} />
		<button>
			<img id="btn-send-msg" src="send.png" alt="send message" />
		</button>
	</form>
</Modal>

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
	#btn-send-msg {
		width: 2em;
		height: 2em;
	}
	textarea {
		resize: none;
	}
</style>
