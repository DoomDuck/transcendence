<script lang="ts">
	import Profile from './Profile.svelte';
	import Modal from './Modal.svelte';
	import GameInvit from './GameInvitBox.svelte';
	import GameInvitButton from './GameInvitButton.svelte';

	let showProfile = false;

	export let image: string;
	export let name: string;
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
			<Profile {image} {name} />
		</Modal>
	{/if}
	<p class="name">{name}</p>
	<GameInvitButton {name} />
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

	.roundedImageFriend {
		overflow: hidden;
		-webkit-border-radius: 50px;
		/* -moz-border-radius: 50px; */
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
