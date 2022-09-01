<script lang="ts">
	import Profile from '$lib/Profile.svelte';
	import Modal from '$lib/Modal.svelte';
	import { getUser } from '$lib/state';
	import AvatarIcon from '$lib/AvatarIcon.svelte';

	export let userId: number;

	const user = getUser(userId);
	let showProfile = false;
</script>

<AvatarIcon
	type={'user'}
	imageURL={$user.avatar ?? 'errorUser.png'}
	on:clickOnImage={() => (showProfile = true)}
/>
<Modal bind:show={showProfile}>
	<Profile user={$user} />
</Modal>
