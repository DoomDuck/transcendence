<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<div id='Play'>
	<div id='chat'>
		<name>
			Joey <img src="https://cdn-icons-png.flaticon.com/512/1632/1632692.png" alt="1" width=30 height=30/>
		</name>
		<!-- <div>
			<input class="champ" type="Chat" value="Search.." >
		</div> -->
	</div>
	<br><br>
	<img on:click="{() => dispatch("start_game")}" src=../src/return.png id="return" alt="return" width=30 height=30/>
</div>


<style>

	#Play {
		width: 100%;
		height: 100%;
		background-color: black;
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
	/* .champ {
		height: 5%;
		width: 100%;
		font-size: 0.5%;
		color: white;
		float : center;
		background-color: #D9D9D9;
		margin-right: 1%;
		margin-left: 1%;
		margin-bottom: 0%;
		margin-top: 90%;
		bottom:0;
		position:relative;
} */
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