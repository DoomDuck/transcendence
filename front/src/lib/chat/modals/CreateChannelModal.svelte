<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import { createEventDispatcher } from 'svelte';
	import { ChannelCategory } from 'backFrontCommon';
	import { chatMethods } from '$lib/ts/chat';

	export let show = false;

	const dispatch = createEventDispatcher();
	let channelCategories = [
		{ id: 'public', label: 'Public', value: ChannelCategory.PUBLIC },
		{ id: 'protected', label: 'Password-protected', value: ChannelCategory.PROTECTED },
		{ id: 'private', label: 'Private', value: ChannelCategory.PRIVATE }
	];
	let channelName: string;
	let chosenCategory: ChannelCategory = ChannelCategory.PUBLIC;
	$: isPasswordProtected = chosenCategory == ChannelCategory.PROTECTED;
	let password: string | undefined;

	function handleSubmit() {
		show = false;
		chatMethods.sendCreateChannel({
			channel: channelName,
			category: chosenCategory,
			password
		});
	}

	function handleBlur() {
		channelName = channelName.trim();
	}
</script>

<Modal bind:show>
	<form id="createChannel" on:submit|preventDefault={handleSubmit}>
		<input
			id="channelName"
			placeholder="Channel Name :"
			bind:value={channelName}
			on:blur={handleBlur}
			required
		/>
		<div id="channelTypes">
			{#each channelCategories as cat}
				<div class="channelType">
					<input
						type="radio"
						id={cat.id}
						name="channelCategory"
						value={cat.value}
						bind:group={chosenCategory}
					/>
					<label for={cat.id}>{cat.label}</label>
				</div>
				{#if cat.value === ChannelCategory.PROTECTED && isPasswordProtected}
					<input id="password" placeholder="Type password" bind:value={password} />
				{/if}
			{/each}
		</div>
		<input type="submit" value="Create channel" />
	</form>
</Modal>

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
</style>
