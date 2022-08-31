<script lang="ts">
	export let placeholder: string;
	export let content = '';

	function handleBlur(_event: FocusEvent) {
		if (content != '0') content = content.replace(/^0*/g, '');
	}

	function handleInput() {
		content = content.replaceAll(/\D/g, '');
	}
</script>

<input
	{placeholder}
	contenteditable="true"
	bind:value={content}
	on:blur={handleBlur}
	on:input={handleInput}
	required
/>

<style>
	input {
		width: 100%;
	}
</style>
