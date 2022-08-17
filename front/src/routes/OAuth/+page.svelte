<script lang="ts">
	import { goto } from '$app/navigation';
	import { request_login, login } from '$lib/login';
	import { onMount } from 'svelte';
	import { PUBLIC_APP_ID } from '$env/static/public';

	let error: any | null = null;

	onMount(async () => {
		console.log(PUBLIC_APP_ID);
		try {
			if (await login()) goto('Main');
		} catch (error_caught: any) {
			error = error_caught.mes;
		}
	});
</script>

{#if error}
	<h1>Error logging in {error}</h1>
{:else}
	<button on:click={request_login}> Connect </button>
{/if}
