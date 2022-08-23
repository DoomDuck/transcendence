<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from '$lib/Modal.svelte';
	import type { DMToServer } from 'backFrontCommon/chatEvents';
	import { isPositiveInteger } from '$lib/utils';

	const dispatch = createEventDispatcher<{ msgToUser: DMToServer }>();

	export let content = '';
	export let show = false;
	let targetStr = '';

	function handleBlur(event: FocusEvent) {
		targetStr = targetStr.trim();
	}
	function handleSubmit(event: SubmitEvent) {
		// DEBUG
		if (!isPositiveInteger(targetStr)) return false;
		dispatch('msgToUser', { target: +targetStr, content });
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
		<input
			id="destinataire"
			placeholder="To :"
			contenteditable="true"
			bind:value={targetStr}
			on:blur={handleBlur}
			required
		/> <br />
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
