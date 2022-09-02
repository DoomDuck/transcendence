<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import { sendDirectMessage } from '$lib/state';
	import SendNewMessageButton from '../buttons/SendNewMessageButton.svelte';
	import PositiveIntegerInput from '../PositiveIntegerInput.svelte';

	export let content = '';
	export let show = false;
	export let predefinedTarget: number | undefined = undefined;
	let target: number;
	if (predefinedTarget !== undefined) target = predefinedTarget;
	let invalidTarget: boolean;

	function handleSubmit() {
		if (invalidTarget) return;
		sendDirectMessage({ target, content });
		close();
		return true;
	}

	function close() {
		show = false;
	}
</script>

<Modal bind:show on:close={close}>
	<form id="formContainer" on:submit|preventDefault={handleSubmit}>
		{#if predefinedTarget === undefined}
			<div id="destinataire">
				<PositiveIntegerInput
					placeholder="ID of the target user:"
					bind:value={target}
					bind:invalid={invalidTarget}
				/>
			</div>
		{/if}
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
		width: 250;
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
