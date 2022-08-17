<script lang="ts">
	import Profile from '$lib/Profile.svelte';
	import Modal from '$lib/Modal.svelte';
	import { ChannelConversation, UserConversation } from './utils';
	import { users } from '$lib/users';
	import type { ChatUserDto } from 'backFrontCommon';
	import RoundedImage from '$lib/RoundedImage.svelte';

	export let userPromise: Promise<ChatUserDto>;

	let showProfile = false;
</script>

{#await userPromise}
	<RoundedImage imageURL="awaiting.png" />
{:then user}
	<RoundedImage imageURL={user.image} on:click={() => (showProfile = true)} />
	<Modal bind:show={showProfile}>
		<Profile {user} />
	</Modal>
{/await}
