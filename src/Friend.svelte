<script>
	
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	
	export let image ='../src/img/canard.jpeg';
	export let friendName = 'Joey';
	
</script>

<div class='friend'>
	<a href="#demo">
		<img class='roundedImageFriend' src={image} alt='profilePic' />
	</a>
		<name> {friendName} </name>
	<div id="demo" class="modal">
		<div class="modal_content">
			<img class='roundedImageProfile' src={image} alt='profilepic'/>
			<br>
			<h2> {friendName} </h2>
			<a href="#" class="modal_close">&times;</a>
		</div>
	</div>
	<img on:click="{() => dispatch("start_waiting")}" class="play" src=../src/img/console.png alt='play' width=50 height=50/>
</div>

<style>

.friend {
	width: 94%;
	height: 6%;
	background: white;
	display: flex;
	align-items: center;
	border: 1px solid #FF00B8;
}

.play {
	margin-left: auto;
	padding: 5%;
}

.roundedImageProfile {
	overflow:hidden; 
	-webkit-border-radius:50px;
	-moz-border-radius:50px;
	border-radius:30px;
	width:60px;
	height:60px;
	margin-top: 2%;
	margin-left: auto;
    margin-right: auto;
	display: block;
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

name {
	color: #FF00B8;
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
	/* padding: 1.5em 2em; */
}

.modal_close {
	position: absolute;
	top: 10px;
	right: 10px;
	color: grey;
	text-decoration: none;
}

</style>