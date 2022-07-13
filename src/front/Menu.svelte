<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let color: string = "#6028FF";

	const dispatch = createEventDispatcher();
</script>

<div id="menu">
	<h1 class="typography" style="color: {color}">Transcendence</h1>
	<h4 class="typography" style="color: {color}"on:click="{() => dispatch("start_game")}">Start a game</h4>
	<h4 class="typography" style="color: {color}"on:click="{() => dispatch("open_chat")}">Chat</h4>
	<h4 class="typography" style="color: {color}"on:click="{() => dispatch("open_paremeters")}">Parameters</h4>
</div>

<style>

#menu {
	background-image: url("../../public/img/starsSky.jpeg");
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.typography {
	text-align: center;
	font-family: 'Press Start 2P';
	font-style: normal;
	/* color: var(--theme-color); */
}
	
h1 {
	line-height: 300%;
	-webkit-text-stroke: 2px #FF29EA;
	text-shadow: 6px 6px 6px purple,
				6px 6px 6px purple;
	font-size: 5em;

}

h4 {
	line-height: 350%;
	-webkit-text-stroke: 1px #FF29EA;
	text-shadow: 4px 4px 4px purple,
				4px 4px 4px purple;
	font-size: 2em;
}

h4:hover{
	background-color: blue;
}

</style>
