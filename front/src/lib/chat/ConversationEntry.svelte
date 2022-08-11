<script lang="ts">
	export let isMe: boolean;
	export let text: string;
	export let author: string | undefined = undefined;
</script>

<article class={isMe ? 'user' : 'interlocutor'}>
	{#if author !== undefined && !isMe}
		<span class="conv-entry-author">{author}</span>
	{/if}
	<span class="conv-entry">{text}</span>
</article>

<style>
	article {
		margin: 0.5em 0;
	}

	span {
		padding: 0.5em 1em;
		display: inline-block;
	}

	.interlocutor {
		text-align: left;
	}

	.interlocutor .conv-entry {
		background-color: #eee;
		border-radius: 1em 1em 1em 0;
	}

	/* .interlocutor .conv-entry-author {
		/* font-size: ; */
	.user {
		text-align: right;
		padding-right: 1em;
	}

	.user .conv-entry {
		background-color: #0074d9;
		color: white;
		border-radius: 1em 1em 0 1em;
		word-break: break-all;
	}
</style>
