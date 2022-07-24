<script lang="ts">
	import Message from './Message.svelte';
	export let username = 'Flash McQueen';
	export let messages = [
		{ text: 'Hello', author: 'Joey' },
		{ text: 'Bye', author: 'Flash McQueen' }
	];
</script>

<div id="message-container">
	{#each messages as message, i}
		<Message
			message={message.text}
			author={message.author}
			nextMessage={messages[i + 1].text}
			nextAuthor={messages[i + 1].author}
			{username}
		/>
	{:else}
		<p>No messages</p>
	{/each}
</div>

<style>
	#message-container {
		height: calc(100% - 45px);
		overflow-y: auto;
		padding: 0 10px;
	}
</style>
