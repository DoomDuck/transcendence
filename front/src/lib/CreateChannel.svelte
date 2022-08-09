<script lang="ts">
	import Modal from './Modal.svelte';
	import Switch from './Switch.svelte';
	import { createEventDispatcher } from 'svelte';
import { ChannelCategory } from 'chat/constants';

	const dispatch = createEventDispatcher();

	let modalVisible = true;
	let channelCategories = [
		{ id: 'public', label: 'Public' },
		{ id: 'protected', label: 'Password-protected' },
		{ id: 'private', label: 'Private' }
	];
  let channelName: string;
	let isProtected: boolean;
	let chosenCategory: string;
  $: category = chosenCategory == 'public' ? (ChannelCategory.PUBLIC : (chosenCategory == 'protected' ? ChannelCategory.PROTECTED : ChannelCategory.PRIVATE));
	$: isPasswordProtected = chosenCategory == 'protected';
	let password: string | undefined;
	function dispacheCreateChannel() {
    dispatch("createChannel", {
      channel: channelName,
      category,
      password
    });
  }
</script>

<img
	src="addGroup.png"
	alt="Create a channel"
	width="50px"
	height="50px"
	on:click={() => (modalVisible = true)}
/>

{#if modalVisible}
	<Modal>
		<div id="createChannel">
			<!-- <Switch optionOne="Private Channel" optionTwo="Public Channel" /> -->
			<input id="channelName" placeholder="Channel Name" bind:value={channelName} required />
			<div id="channelTypes">
				{#each channelCategories as cat}
					<div class="channelType">
						<input
							type="radio"
							id={cat.id}
							name="channelCategory"
							value={cat.id}
							bind:group={chosenCategory}
						/>
						<label for={cat.id}>{cat.label}</label>
					</div>
					{#if cat.id === 'protected' && isPasswordProtected}
						<input id="password" placeholder="Type password" bind:value={password} />
					{/if}
				{/each}
			</div>
			<button
				on:click={() => {
					modalVisible = false;
					dispacheCreateChannel();
				}}
			>
				Create channel
			</button>
		</div>
	</Modal>
{/if}

<style>
	#createChannel {
		display: flex;
		flex-direction: column;
		width: 250px;
		gap: 20px;
		padding: 10px;
	}
	#channelTypes {
		display: flex;
		flex-direction: column;
	}
	.channelType {
		display: flex;
		flex-direction: row;
		justify-items: left;
		gap: 10px;
		padding: 10px;
	}
	img {
		float: right;
	}
</style>
