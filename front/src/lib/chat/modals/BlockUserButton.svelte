<script lang="ts">
	import type { ChatUserDto } from 'backFrontCommon';
	import BlockUserModal from './BlockUserModal.svelte';

	export let user: ChatUserDto;

	let show = false;
</script>

<img
	src="blockingIcon.png"
	alt="block user"
	width="25px"
	height="25px"
	on:click={() => (show = true)}
/>

<BlockUserModal bind:show {user} on:blockUser />
