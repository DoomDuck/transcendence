<script lang="ts">

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function newMessage(){
		alert('New Message')
	}

</script>

<div id="chat">
	<div id="title"> 
		<h1 on:click="{() => dispatch("open_menu")}">
			Chat
		</h1>
		<a href="#demo"> 
			<img src=../src/write.png width="40" height="40" alt="write msg"/>
		</a>
		<div id="demo" class="modal">
			<div class="modal_content">
				<input class='destinataire' type='search' value="to :"/>
				<input class="message" type='text' value="my message..."/>
				<br>
				<img src=../src/send.png alt="send" width='30' height='30'/>
				<a href="#" class="modal_close">&times;</a>
			</div>
		</div>
	</div>

	<input class="champ" type="search" value="Search.." > <br> <br> <br>
	<div id="online"> <br> Online friends </div>
	<div id="bigrectangle">
		{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as _}
		<img class="roundedImage" src="http://www.animogen.com/wp-content/uploads/2014/02/canard-adoption-choix-alimentation-eau-hygi%C3%A8ne-sant%C3%A9-maintien-caract%C3%A8re-crit%C3%A8re-oiseau-basse-cour-animal-animaux-compagnie-animogen-5.jpg" alt="contact"/>
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
	overflow: hidden;
	display:flex;
	flex-flow: column wrap;
}

#title {
	display:flex;
	justify-content: space-between;
}
	
h1 {
	justify-content: left;
	font-style: normal;
	color: #FF00B8;
	line-height: 150%;
	-webkit-text-stroke: 2px #ECF100;
	margin-left: 5%;
}

img {
	justify-content: right;
	float: right;
	display: inline-block;
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
}

.modal:target {
  visibility: visible;
  opacity: 1;
}

.modal_content {
  border-radius: 4px;
  position: relative;
  width: 500px;
  max-width: 90%;
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

.destinataire {
	width: 70%;
	height: 5%;
	font-size: 0.5%;
	color: white;
	background-color: #D9D9D9;
}

.message {
	width: 70%;
	height: 50%;
	font-size: 0.5%;
	color: white;
	background-color: #D9D9D9;
}

.champ {
	height: 40px;
	width: 98%;
	font-size: 0.5%;
	color: white;
	background-color: #D9D9D9;
	margin-right: 1%;
	margin-left: 1%;
}

#bigrectangle {
	width: 95%;
	height:8%;
	background: white;
	display: flex;
	flex-wrap: nowrap;
	overflow-x: auto;
	margin-left: 2%;
}

#online {
	color: white;
	width:95%;
	height:3%;
	background: #FF00B8;
	margin-left: 2%;
}

.roundedImage {
	overflow:hidden; 
	-webkit-border-radius:50px;
	-moz-border-radius:50px;
	border-radius:50px;
	width:90px;
	height:90px;
	margin-left: 2%;
	margin-right: 1%;
	margin-top: 1%;
	flex: 0 0 auto;
}

</style>