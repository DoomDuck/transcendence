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

<nav id="menu">
	{#if !loginPromise}
			<h1 class="typography">Login</h1>
			<h4 class="typography" on:click={loginAs('user')}> User </h4>
			<h4 class="typography" on:click={loginAs('guest')}> Guest </h4>
	{:else}
		{#await loginPromise}
			<h1>Logging in...</h1>
		{:catch}
			<h1>Could not loggin an error occured</h1>
		{/await}
	{/if}
</nav>

<style>
	#menu {
		background-image: url('/starsSky.png');
		background-size: cover;
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.typography {
		font-family: 'Press Start 2P';
		font-style: normal;
		color: #6028FF;
	}

	h1 {
		line-height: 300%;
		-webkit-text-stroke: 2px #ff29ea;
		text-shadow: 6px 6px 6px purple, 6px 6px 6px purple;
		font-size: 6vh;
	}

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