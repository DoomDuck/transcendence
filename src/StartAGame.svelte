<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<div id="start_a_game">
	<br><br><br>
	<h4 on:click="{() => dispatch("Play")}" >Play</h4>
	<h4>Challenge a friend</h4>
</div>

<style>
#start_a_game {
	width: 100%;
	height: 100%;
	background-color: #EA0ED4;
}

h4 {
	text-align: center;
	font-family: 'Press start 2P';
	font-style: normal;
	color: blue;
	line-height: 500%;
	-webkit-text-stroke: 1px #000000;
	font-size: 2em;
	height: 10em; /* hauteur du parent */
	line-height: 10em; /* hauteur de ligne (identique) */
}

h4:hover{
	background-color: purple;
}

</style>