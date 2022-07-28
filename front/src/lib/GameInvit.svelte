<script lang="ts">
	import Switch from './Switch.svelte';
	export let friendName: string;
</script>

<div id="invitation">
	<Switch optionOne="Classic Mode" optionTwo="Special Mode" />
	<a sveltekit:prefetch href="/WaitingRoom">
		<button>
			Invit {friendName} to play
		</button>
	</a>
</div>

<style>
	#invitation {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
		padding: 15px;
	}
</style>
