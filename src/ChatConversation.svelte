<script lang="ts">
import { invalid_attribute_name_character } from "svelte/internal";

	export let name = "Falsh McQueen";
	export let image = "../src/img/cars.jpeg";

	export let has_new_message = false;

</script>

<div class="conv">
	<img class="roundedImageConv" src={image} alt="contact" />
	<h5>{name}</h5>
	{#if has_new_message}
		<img class="notif" src=../src/img/notification.png alt="notif" width=35 height=35/>
	{/if}
</div>

<style>

h5 {
	font-size: 1em;
	color: #FF00B8;
}

img {
	display: inline-block;
	float: right;
	justify-content: right;
}

.conv {
	align-items: center;
	width: 95%;
	height: 6%;
	background: white;
	display: flex;
	margin-left: 2%;
	border: 1px solid #FF00B8;
}

.notif {
	margin-left: auto;
	padding: 5%;
}

.roundedImageConv {
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

</style>