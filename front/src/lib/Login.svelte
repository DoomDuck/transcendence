<script lang="ts">
	import { onMount } from 'svelte';
	import { login, guestLogin, preLogin } from '$lib/ts/login';

	onMount(preLogin);
</script>

<div id="main">
	<div id="login">
		<h1>Login</h1>
		<h4 on:click={login}>User</h4>
		<h4 on:click={guestLogin}>Guest</h4>
	</div>
</div>

<style>
	#main {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	#login {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	h4:hover {
		background-color: blue;
		width: 100%;
		text-align: center;
	}
</style>
