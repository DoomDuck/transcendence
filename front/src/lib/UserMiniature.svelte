<script lang="ts">
	import Profile from '$lib/Profile.svelte';
	import Modal from '$lib/Modal.svelte';
	import { users } from '$lib/users';
	import type { Id } from 'backFrontCommon';
	import AvatarIcon from '$lib/AvatarIcon.svelte';

	export let userId: Id;
	const userPromise = $users.findOrFetch(userId);

	let showProfile = false;
</script>

{#await userPromise}
	<AvatarIcon type={'user'} imageURL="awaiting.png" />
{:then user}
	<AvatarIcon type={'user'} imageURL={user.image} on:clickOnImage={() => (showProfile = true)} />
	<Modal bind:show={showProfile}>
		<Profile {user} />
	</Modal>
{/await}
