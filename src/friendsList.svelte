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
			<a href="#demo"> 
				<img class='roundedImageFriend' src=../src/img/cars.jpeg alt='friendPic' />
			</a>
				<name> Flash McQueen </name>
			<div id="demo" class="modal">
				<div class="modal_content">
					<img class='roundedImageProfile' src=../src/img/cars.jpeg alt='profilePic'/>
					<a href="#" class="modal_close">&times;</a>
				</div>
			</div>
			<img on:click="{() => dispatch("start_waiting")}" class="play" src=../src/img/console.png alt='play' width=50 height=50/>
		</div>
		<div class='friend'>
			<a href="#demo">
				<img class='roundedImageFriend' src=../src/img/canard.jpeg alt='profilePic' />
			</a>
				<name> Joey </name>
			<div id="demo" class="modal">
				<div class="modal_content">
					<img class='roundedImageProfile' src=../src/img/canard.jpeg alt='profilepic'/>
					<a href="#" class="modal_close">&times;</a>
				</div>
			</div>
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
	width:50px;
	height:50px;
	margin-left: 1%;
	margin-right: 10%;
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

.roundedImageProfile {
	overflow:hidden; 
	-webkit-border-radius:50px;
	-moz-border-radius:50px;
	border-radius:30px;
	width:60px;
	height:60px;
}

.modal {
	visibility: hidden;
	opacity: 0;
	position: absolute;
	top: 0; right: 0;
	bottom: 0; left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(77, 77, 77, .7);
	transition: all .4s;
	padding: auto;
}

.modal:target {
	visibility: visible;
	opacity: 1;
}

.modal_content {
	flex-direction: column;
	border-radius: 4px;
	position: relative;
	width: 40%;
	height: 40%;
	background: white;
	padding: 1.5em 2em;
}

.modal_close {
	position: absolute;
	top: 10px;
	right: 10px;
	color: grey;
	text-decoration: none;
}

</style>