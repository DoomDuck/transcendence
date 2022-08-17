<script lang="ts">
	export let text: string | Promise<string>;
	const promisedText = Promise.resolve(text);
</script>

{#await promisedText}
	<h5>...</h5>
{:then text}
	<h5>{text}</h5>
{/await}

<style>
	h5 {
		font-size: 1em;
		color: #ff00b8;
	}
</style>
