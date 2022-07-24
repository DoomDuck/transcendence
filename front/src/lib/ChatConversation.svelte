<script lang="ts">
	import Profile from './Profile.svelte';
	import Modal from './Modal.svelte';

	export let friendName: string;
	export let image: string;

	let showProfile = false;
	export let has_new_message = false;
</script>

<div class="conv">
	<img class="roundedImageConv" src={image} alt="contact" on:click={() => (showProfile = true)} />
	<h5>{friendName}</h5>
	{#if showProfile}
		<Modal on:close={() => (showProfile = false)}>
			<Profile {image} {friendName} />
		</Modal>
	{/if}
	{#if has_new_message}
		<img class="notif" src="notification.png" alt="notif" width="35" height="35" />
	{/if}
</div>

<style>
	h5 {
		font-size: 1em;
		color: #ff00b8;
	}

	img {
		float: right;
		justify-content: right;
	}

	.conv {
		align-items: center;
		width: 95vw;
		height: 70px;
		background: white;
		display: flex;
		border: 1px solid #ff00b8;
	}

	.notif {
		margin-left: auto;
		padding: 5%;
	}

	.roundedImageConv {
		overflow: hidden;
		-webkit-border-radius: 50px;
		-moz-border-radius: 50px;
		border-radius: 30px;
		width: 60px;
		height: 60px;
		margin-left: 1%;
		margin-right: 2%;
		margin-top: auto;
		margin-bottom: auto;
	}
</style>
