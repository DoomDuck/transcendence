<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<div id='Play'>
	<div id='chat'>
		<name> Joey <img src="https://cdn-icons-png.flaticon.com/512/1632/1632692.png" alt="1" width=30 height=30/> </name>
	</div>
	<br><br>
	<img on:click="{() => dispatch("start_game")}" src=../src/img/return.png id="return" alt="return" width=30 height=30/>
</div>


<style>

	#Play {
		width: 100%;
		height: 100%;
		background-image: url("../src/img/starsSky.jpeg");
		overflow: hidden;
	}
	img {
		float: right;
		margin-right: 7%;
		margin-top: 3%;
	}
	#chat {
		width: 30%;
		height:70%;
		background: white;
		display: flex;
		flex-wrap: nowrap;
		margin-left: auto;
		margin-right: 2%;
		margin-top: 15%;
	}
	#return{
		float: left;
		margin-left: 3%;
	}
	name {
		width: 100%;
		height:5%;
		background: #D9D9D9;
		color: white;
		text-align: left;
		font-size: 1em;
		font-family: 'Press start 2P';
		line-height: 300%;
	}

</style>