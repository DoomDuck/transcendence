<script lang="ts">
	import { sendChangeName, socket } from './state';

	export let name: string;
	let changeName = false;

	function confirmChange() {
		sendChangeName({ name });
		changeName = false;
	}
</script>

{#if !changeName}
	<h1 on:click={() => (changeName = true)}>{name}</h1>
{:else}
	<div>
		<input bind:value={name} placeholder={name} />
		<img src="check.png" alt="confirm new name" width="30" height="30" on:click={confirmChange} />
	</div>
{/if}
