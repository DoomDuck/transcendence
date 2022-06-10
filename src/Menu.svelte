<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let color: string = "#6028FF";

	const dispatch = createEventDispatcher();
</script>

<head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Passion+One:wght@900&family=Press+Start+2P&display=swap" rel="stylesheet">
</head>

<body>
	
<h1 class="typography" style="color: {color}">Transcendence</h1>
<h4 class="typography" style="color: {color}"on:click="{() => dispatch("start_game")}">Start a game</h4>
<h4 class="typography" style="color: {color}"on:click="{() => dispatch("open_chat")}">Chat</h4>
<h4 class="typography" style="color: {color}"on:click="{() => dispatch("open_paremeters")}">Parameters</h4>

<style>
	
body{
	background-color: #000000;
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
	text-shadow: 4px 4px 4px purple,
				4px 4px 4px purple;
}

h4 {
	line-height: 350%;
	-webkit-text-stroke: 1px #FF29EA;
	text-shadow: 4px 4px 4px purple,
				4px 4px 4px purple;
}

h4:hover{
	background-color: blue;
}

</style>
	
</body>
