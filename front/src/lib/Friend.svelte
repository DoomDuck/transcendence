<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Profile from './Profile.svelte';
	import Modal from './Modal.svelte';

	const dispatch = createEventDispatcher();

	let showProfile = false;

	export let image: string;
	export let friendName: string;
</script>

<div class="friend">
	<img
		class="roundedImageFriend"
		src={image}
		alt="profilePic"
		on:click={() => (showProfile = true)}
	/>
	{#if showProfile}
		<Modal on:close={() => (showProfile = false)}>
			<Profile {image} {friendName} />
		</Modal>
	{/if}

	<p class="name">{friendName}</p>
	<img
		on:click={() => dispatch('start_waiting')}
		class="play"
		src="joystick.png"
		alt="play"
		width="40px"
		height="40px"
	/>
</div>

<style>
	.friend {
		width: 80vw;
		height: 70px;
		background: #05053d;
		display: flex;
		align-items: center;
		border: 1px solid #a80a2f;
	}

	.play {
		margin-left: auto;
		padding: 5%;
	}

	.roundedImageFriend {
		overflow: hidden;
		-webkit-border-radius: 50px;
		-moz-border-radius: 50px;
		border-radius: 30px;
		width: 50px;
		height: 50px;
		margin-left: 1%;
		margin-right: 2vw;
		margin-top: auto;
		margin-bottom: auto;
	}

	.name {
		color: #a80a2f;
	}
</style>
