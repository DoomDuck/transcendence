<script lang="ts">
	import type { DMToServer } from 'chat/constants';

	import { createEventDispatcher } from 'svelte';

	export let content: string;

	const dispach = createEventDispatcher<{ msgToUser: DMToServer }>();
	let target: string = '';

	function handleBlur(event: FocusEvent) {
		target = target.trim();
	}
	function handleSubmit(event: SubmitEvent) {
		dispach('msgToUser', { target, content });
	}
</script>

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
		<img src="send.png" alt="send message" />
	</button>
	<!-- </div> -->
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
