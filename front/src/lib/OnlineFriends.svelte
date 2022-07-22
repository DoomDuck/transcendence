<script lang="ts">
	export let onlineFriends = [];
	export let profilePic = 'img/canard.jpeg';
</script>

<div>
	<div id="online"><br /> Online friends</div>
	<div class="onlineFriends">
		{#each onlineFriends as friend}
			<img class="roundedImage" src={profilePic} alt="contact" />
		{/each}
	</div>
</div>

<style>
	.roundedImage {
		overflow: hidden;
		-webkit-border-radius: 50px;
		-moz-border-radius: 50px;
		border-radius: 50px;
		width: 90px;
		height: 90px;
		margin-left: 2%;
		margin-right: 1%;
		margin-top: auto;
		margin-bottom: auto;
		flex: 0 0 auto;
	}

	.onlineFriends {
		width: 95vw;
		height: 80px;
		background: white;
		display: flex;
		flex-wrap: nowrap;
		overflow-x: auto;
	}

	#online {
		color: white;
		width: 95vw;
		height: 40px;
		background: #ff00b8;
	}
</style>
