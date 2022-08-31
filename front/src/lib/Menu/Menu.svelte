<script lang="ts">
</script>

<nav class="menu">
	<slot />
</nav>

<style>
	.menu {
		background-image: url('/starsSky.png');
		background-size: cover;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
