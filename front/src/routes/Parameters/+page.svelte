<script lang="ts">
	import { state } from '$lib/ts/state';
	import TotpSetupButton from '$lib/TotpSetupButton.svelte';
	import ProfileParams from '$lib/ProfileParams.svelte';
	export let blocked = [{ profilePic: 'cars.jpeg', name: 'Flash McQueen' }];
</script>

<div id="app">
	<ProfileParams avatar={state.myInfo.avatar} name={state.myInfo.name} />
	<div id="blockedProfiles">
		<div class="blocked">
			<div class="blockedInfos">
				{#each blocked as { profilePic, name }}
					<img class="roundedImage" src={profilePic} alt="contact" />
					<h3>{name}</h3>
				{/each}
			</div>
			<button> unblock </button>
		</div>
	</div>
	<div id="lastParams">
		<TotpSetupButton />
		<button id="disco" on:click={state.disconnect.bind(state)}> Disconnect </button>
	</div>
</div>

<style>
	* {
		font-family: 'Lato', sans-serif;
		color: #06bcff;
	}

	#app {
		background-image: url('starsSky.jpeg');
		width: 100%;
		height: 100%;
		overflow-y: scroll;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	#blockedProfiles {
		width: 50vw;
		height: 600px;
		overflow-y: auto;
		overflow-x: hidden;
		display: flex;
		flex-direction: column;
		border: 1px solid #ff00b8;
	}
	.blocked {
		width: 50vw;
		height: 100px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.roundedImage {
		overflow: hidden;
		-webkit-border-radius: 50px;
		-moz-border-radius: 50px;
		border-radius: 30px;
		width: 60px;
		height: 60px;
		margin: 20px;
	}
	.blockedInfos {
		display: flex;
		flex-direction: row;
		justify-content: right;
		align-items: center;
	}
	button {
		margin: 20px;
	}
	#lastParams {
		width: 50vw;
		height: 80px;
		border: 1px solid #ff00b8;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	input {
		margin: 20px;
	}
	#disco {
		float: right;
		width: 150px;
		height: 30px;
	}
</style>
