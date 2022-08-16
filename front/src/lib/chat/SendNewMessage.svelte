<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from '$lib/Modal.svelte';
	import type { DMToServer } from 'backFrontCommon/chatEvents';

	const dispach = createEventDispatcher<{ msgToUser: DMToServer }>();

	export let content = '';
	let writeNewMsgModal = false;
	let target = '';

	function handleBlur(event: FocusEvent) {
		target = target.trim();
	}
	function handleSubmit(event: SubmitEvent) {
		dispach('msgToUser', { target, content });
	}
</script>

<img
	id="btn-new-message"
	src="pencil.png"
	width="40"
	height="40"
	alt="write msg"
	on:click={() => (writeNewMsgModal = true)}
/>

{#if writeNewMsgModal}
	<Modal on:close={() => (writeNewMsgModal = false)}>
		<form id="formContainer" on:submit|preventDefault={handleSubmit}>
			<!-- <div id="formContainer"> -->
			<input
				id="destinataire"
				placeholder="To :"
				contenteditable="true"
				bind:value={target}
				on:blur={handleBlur}
				required
			/> <br />
			<textarea id="message" type="text" placeholder="Type a message..." bind:value={content} />
			<button>
				<img id="btn-send-msg" src="send.png" alt="send message" />
			</button>
			<!-- </div> -->
		</form>
	</Modal>
{/if}

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

	#btn-new-message {
		float: right;
	}
	#btn-send-msg {
		width: 2em;
		height: 2em;
	}
	textarea {
		resize: none;
	}
</style>
