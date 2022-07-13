<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Friend from './Friend.svelte';

	const dispatch = createEventDispatcher();
</script>

	<div class="friendsList"> 
		<h1> Friends List </h1>
		<br>
		<input class="champ" type='search' value="search..." />
		<br> <br>
		<Friend friendName='Flash McQueen' image='../src/img/cars.jpeg'/>
		<Friend friendName='Joey' image='../src/img/canard.jpeg'/>
		<br><br>
		<img on:click="{() => dispatch("start_game")}" src=../src/img/return.png id="return" alt="return" width=30 height=30/>
	</div>

<style>

* {
	font-family: 'Press Start 2P';
}

h1 {
	color: #D0C5FF;
	-webkit-text-stroke: 2px white;
	font-size: 3em;
	line-height: 300%;
	text-align: center;
}

h2 {
	color: #FF00B8;
	font-size: 0.7em;
	text-align: center;
	
}

input {
	height: 3%;
	width: 94%;
	font-size: 80%;
	color: white;
	background-color: #D9D9D9;
}

.friendsList {
	background-color: #9584FF;
	width: 100%;
	height: 100%;
	overflow: hidden;
	flex-direction: column;
	padding: 3%;
}

#return {
	float: left;
	margin-left: 3%;
}



</style>