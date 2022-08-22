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
	<h1>Login</h1>
	<h4 on:click={loginAs('user')}> User </h4>
	<h4 on:click={loginAs('guest')}> Guest </h4>
{:else}
	{#await loginPromise}
		<h1> Logging in... </h1>
	{:catch}
		<h1> Could not loggin an error occured </h1>
	{/await}
{/if}

<style>
	h4:hover {
		background-color: blue;
		width: 100%;
		text-align: center;
	}
</style>