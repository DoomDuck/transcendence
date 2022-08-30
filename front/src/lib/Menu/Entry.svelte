<script lang="ts">
	import Text from '$lib/Text.svelte';
	export let href: string;
</script>

<h4>
	<Text><a {href}><slot /></a></Text>
</h4>

<style>
	h4:hover {
		background-color: blue;
		width: 100%;
		text-align: center;
	}
</style>
