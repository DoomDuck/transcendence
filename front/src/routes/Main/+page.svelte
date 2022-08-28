<script lang="ts">
	import { users } from '$lib/ts/users';
	import { delay } from 'pong/common/utils';

	let color: string = '#6028FF';
</script>

<nav id="menu">
	<h1 class="typography" style="color: {color}">Transcendence</h1>
	<h4 class="typography" style="color: {color}">
		<a href="/StartAGame">Game</a>
	</h4>
	<h4 class="typography" style="color: {color}">
		<a href="/Chat">Chat</a>
	</h4>
	<h4 class="typography" style="color: {color}">
		<a href="/Parameters">Parameters</a>
	</h4>
	{#await delay(1000).then(() => $users.findOrFetchMyself()) then user}
		<p style="color: white">(DEBUG) My id is {user.id}</p>
	{/await}
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
