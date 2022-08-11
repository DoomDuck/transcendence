<script lang="ts">
	export let onlineFriends = [
		{ image: 'cars.jpeg', name: 'car' },
		{ image: 'canard.jpeg', name: 'canard' }
	];
</script>

<div>
	<div id="online"><br /> Online friends</div>
	<div class="onlineFriends">
		{#each onlineFriends as { image, name }}
			<div>
				<img class="roundedImage" src={image} alt="contact" />
				<h4>{name}</h4>
			</div>
		{/each}
	</div>
</div>

<style>
	.roundedImage {
		overflow: hidden;
		-webkit-border-radius: 40px;
		/* -moz-border-radius: 40px; */
		border-radius: 40px;
		width: 70px;
		height: 70px;
		margin-left: 10px;
		margin-right: 10px;
		margin-top: auto;
		margin-bottom: auto;
		flex: 0 0 auto;
	}

	.onlineFriends {
		width: 80vw;
		height: 80px;
		/* background: #140128; */
		display: flex;
		flex-wrap: nowrap;
		overflow-x: auto;
	}

	#online {
		color: #fa1ec7;
		width: 80vw;
		height: 40px;
		background: #12072e;
	}
</style>
