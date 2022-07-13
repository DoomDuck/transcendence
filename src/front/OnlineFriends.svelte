<script lang="ts">

	export let onlineFriends = [];
	export let profilePic = "img/canard.jpeg" ;
</script>

<div id="online"> <br> Online friends </div>
<div class="onlineFriends">
	{#each onlineFriends as friend}
		<img class="roundedImage" src={friend.profilePic} alt="contact"/>
	{/each}
</div>

<style>

.roundedImage {
	overflow:hidden; 
	-webkit-border-radius:50px;
	-moz-border-radius:50px;
	border-radius:50px;
	width:90px;
	height:90px;
	margin-left: 2%;
	margin-right: 1%;
	margin-top: auto;
    margin-bottom: auto;
	flex: 0 0 auto;
}

.onlineFriends {
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

</style>