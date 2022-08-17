<script lang="ts">
	import Text from '$lib/Text.svelte';
	export let href: string;
</script>

<h4>
	<Text><a sveltekit:prefetch {href}><slot /></a></Text>
</h4>

<style>
	h4 {
		line-height: 350%;
		-webkit-text-stroke: 1px #ff29ea;
		text-shadow: 5px 5px 5px purple, 5px 5px 5px purple;
		font-size: 3.5vh;
	}

	h4:hover {
		background-color: blue;
		width: 100%;
		text-align: center;
	}

	a {
		all: unset;
	}
</style>
