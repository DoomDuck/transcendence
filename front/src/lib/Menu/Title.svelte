<script lang="ts">
	import Text from '$lib/Text.svelte';
</script>

<Text><h1><slot /></h1></Text>

<style>
	h1 {
		line-height: 300%;
		-webkit-text-stroke: 2px #ff29ea;
		text-shadow: 6px 6px 6px purple, 6px 6px 6px purple;
		font-size: 6vh;
	}
</style>
