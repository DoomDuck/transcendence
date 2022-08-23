<script lang="ts">
	import { onMount } from 'svelte';
	import { login, guestLogin, preLogin } from '$lib/ts/login';

	onMount(preLogin);
</script>

<h1>Login</h1>
<h4 on:click={login}> User </h4>
<h4 on:click={guestLogin}> Guest </h4>

<style>
	h4:hover {
		background-color: blue;
		width: 100%;
		text-align: center;
	}
</style>
