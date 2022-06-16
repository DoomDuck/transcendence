<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

	<div class="friendsList"> 
		<h1> Friends List </h1>
		<br>
		<input class="champ" type='search' value="search..." />
		<br> <br>
		<div class='friend'>
			<img class='roundedImageFriend' src=../src/img/cars.jpeg alt='friendPic' />
			<name> Flash McQueen </name>
			<img on:click="{() => dispatch("start_waiting")}" class="play" src=../src/img/console.png alt='play' width=50 height=50/>
		</div>
		<div class='friend'>
			<img class='roundedImageFriend' src=../src/img/canard.jpeg alt='friendPic' />
			<name> Joey </name>
			<img on:click="{() => dispatch("start_waiting")}" class="play" src=../src/img/console.png alt='play' width=50 height=50/>
		</div>
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

input {
	height: 3%;
	width: 94%;
	font-size: 80%;
	color: white;
	background-color: #D9D9D9;
}

name {
	color: #FF00B8;
}

.friendsList {
	background-color: #9584FF;
	width: 100%;
	height: 100%;
	overflow: hidden;
	flex-direction: column;
	padding: 3%;
}

.friend {
	width: 94%;
	height: 6%;
	background: white;
	display: flex;
	align-items: center;
	border: 1px solid #FF00B8;
}

.roundedImageFriend {
	overflow:hidden; 
	-webkit-border-radius:50px;
	-moz-border-radius:50px;
	border-radius:30px;
	width:60px;
	height:60px;
	margin-left: 1%;
	margin-right: 2%;
	margin-top: auto;
    margin-bottom: auto;
}

.play {
	margin-left: auto;
	padding: 5%;
}

#return {
	float: left;
	margin-left: 3%;
}

</style>