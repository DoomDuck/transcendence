<script lang="ts">
	import { users } from '$lib/ts/users';
	import { delay } from 'pong/common/utils';

	let color: string = '#6028FF';
</script>

<nav id="menu">
<<<<<<< HEAD
	<div id='options'>
=======
	<div id="options">
>>>>>>> origin/front
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
		{#await $users.findOrFetchMyself() then user}
			<p style="color: white">(DEBUG) My id is {user.id}</p>
		{/await}
	</div>
</nav>

<style>
	#menu {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	#options {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 4vh;
	}
	h1 {
		font-size: 4em;
	}
	@media (max-width: 820px) {
		h1 {
			font-size: 3em;
		}
	}
	@media (max-width: 620px) {
		h1 {
			font-size: 2.4em;
		}
	}
	h4 {
		font-size: 2em;
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
