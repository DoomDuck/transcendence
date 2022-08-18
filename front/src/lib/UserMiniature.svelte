<script lang="ts">
	import Profile from '$lib/Profile.svelte';
	import Modal from '$lib/Modal.svelte';
	import { users } from '$lib/users';
	import type { Id } from 'backFrontCommon';
	import RoundedImage from '$lib/RoundedImage.svelte';

	export let userId: Id;
	const userPromise = $users.findOrFetch(userId);

	let showProfile = false;
</script>

{#await userPromise}
	<RoundedImage imageURL="awaiting.png" />
{:then user}
	<RoundedImage imageURL={user.image} on:clickOnImage={() => (showProfile = true)} />
	<Modal bind:show={showProfile}>
		<Profile {user} />
	</Modal>
{/await}
