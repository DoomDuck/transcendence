<script lang="ts">

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function newMessage(){
		alert('New Message')
	}

</script>

<div id="chat">
	<h1 on:click="{() => dispatch("open_menu")}">
		Chat
		<img on:click={newMessage} src="https://cdn-icons.flaticon.com/png/512/4007/premium/4007779.png?token=exp=1654716287~hmac=1dd3386ee5e4fa6c2b04bd5d090f02a4" width="40" height="40" alt="write msg">
	</h1>

	<input class="champ" type="search" value="Search.." > <br> <br> <br>
	<div id="online"> <br> Online friends </div>
	<div id="bigrectangle">
		{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as _}
		<img class="roundedImage" src="http://www.animogen.com/wp-content/uploads/2014/02/canard-adoption-choix-alimentation-eau-hygi%C3%A8ne-sant%C3%A9-maintien-caract%C3%A8re-crit%C3%A8re-oiseau-basse-cour-animal-animaux-compagnie-animogen-5.jpg" alt="1"/>
		{/each}
	</div>
</div>

<style>

* {
	font-family: 'Press Start 2P';
}

#chat {
	width: 100%;
	height: 100%;
	background-color: #4628FF;
}
	
h1 {
	text-align : left;
	font-style: normal;
	color: #FF00B8;
	line-height: 150%;
	-webkit-text-stroke: 2px #ECF100;
}

img {
	float: right;
	display: inline-block;
}

.champ {
	height: 40px;
	width: 100%;
	font-size: 0.5%;
	color: white;
	background-color: #D9D9D9;
}

#bigrectangle {
	width: 95%;
	height:8%;
	background: white;
	display: flex;
	flex-wrap: nowrap;
	overflow-x: auto;
}

#online {
	color: white;
	width:95%;
	height:3%;
	background: #FF00B8;
}

.roundedImage {
	overflow:hidden; 
	-webkit-border-radius:50px;
	-moz-border-radius:50px;
	border-radius:50px;
	width:90px;
	height:90px;
	margin-left: 2%;
	flex: 0 0 auto;
}

</style>