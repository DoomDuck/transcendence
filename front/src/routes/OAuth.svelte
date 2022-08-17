<script lang="ts">
	import { goto } from '$app/navigation';
	import { request_login, login } from '$lib/login';
	import { onMount } from 'svelte';
<<<<<<< HEAD

=======
	import { PUBLIC_APP_ID } from '$env/static/public';
	
>>>>>>> cebad954eb8c8db98fc33134f386878c041e9512
	let error: any | null = null;

	onMount(async () => {
		console.log(PUBLIC_APP_ID);
		try {
<<<<<<< HEAD
			if (await login()) goto('Main');
		} catch (error_caught) {
=======
			if (await login())
				goto('Main');
		} catch (error_caught: any) {
>>>>>>> cebad954eb8c8db98fc33134f386878c041e9512
			error = error_caught.mes;
		}
	});
</script>

{#if error}
	<h1>Error logging in {error}</h1>
{:else}
	<button on:click={request_login}> Connect </button>
{/if}
