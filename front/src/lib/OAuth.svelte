<script lang="ts">
	import { onMount } from 'svelte';
	import { login, guestLogin, preLogin } from '$lib/login';
	
	onMount(preLogin);

	let loginPromise: null | Promise<void> = null;
	
	const loginCallbacks = {
		user: login,
		guest: guestLogin,
	};
	
	function loginAs(userOrGuest: 'user'| 'guest') {
		return () => loginPromise = loginCallbacks[userOrGuest]();
	}
</script>

{#if !loginPromise}
	<button on:click={loginAs('user')}>User</button>
	<button on:click={loginAs('guest')}>Guest</button>
{:else}
	{#await loginPromise}
		<p>Logging in...</p>
	{:catch}
		<p>Could not loggin an error occured</p>
	{/await}
{/if}
