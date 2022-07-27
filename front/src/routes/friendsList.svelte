<script lang="ts">
	import { onMount } from 'svelte';
	import Friend from '$lib/Friend.svelte';
	export let friendNameSearch: () => void;

	onMount(async () => {
		const reponse = await fetch('http://localhost:5000/user', {
			method: 'GET'
		});

		const result = await reponse.json();

		console.log(result);
	});
</script>

<div class="friendsList">
	<h1>Friends List</h1>
	<form on:submit|preventDefault={friendNameSearch}>
		<input type="search" placeholder="search..." />
	</form>
	<div>
		<Friend friendName="Flash McQueen" image="cars.jpeg" />
		<Friend friendName="Joey" image="canard.jpeg" />
	</div>
</div>

<style>
	* {
		font-family: 'Press Start 2P';
	}

	h1 {
		color: #0b0b41;
		-webkit-text-stroke: 2px #a80a2f;
		font-size: 3em;
		line-height: 300%;
		text-align: center;
	}

	@media (max-width: 600px) {
		h1 {
			font-size: 2em;
		}
	}

	input {
		height: 40px;
		width: 80vw;
		color: rgb(105, 99, 99);
		background-color: #bdbdbd;
	}

	.friendsList {
		background-image: url('starsSky.jpeg');
		width: 100vw;
		height: 100vh;
		overflow-y: scroll;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow-y: scroll;
		gap: 30px;
	}
</style>
