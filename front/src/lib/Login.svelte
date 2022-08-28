<script lang="ts">
	import { onMount } from 'svelte';
	import { login, guestLogin, preLogin } from '$lib/ts/login';

	onMount(preLogin);
</script>


<div id='login'>
	<h1>Login</h1>
	<h4 on:click={login}>User</h4>
	<h4 on:click={guestLogin}>Guest</h4>
</div>

<style>
	#login{
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	h4:hover {
		background-color: blue;
		width: 100%;
		text-align: center;
	}
</style>
