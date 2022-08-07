<script lang="ts">
	import DirectMessages from './ConversationListItem.svelte';
	import { onMount } from 'svelte';
	import { type ConversationType } from './types';

	let conversations: ConversationType[] = [
		{
			interlocutor: 'couillax',
			comments: [
				{
					author: 'couillax',
					text: 'Haha, je suis couillax sale enculé'
				},
				{
					author: 'couillax',
					text: 'rentre chez toi sale enculé'
				}
			]
		},
		{
			interlocutor: 'maman',
			comments: [
				{
					author: 'me',
					text: 'Haha, je suis moi'
				},
				{
					author: 'maman',
					text: 'rentre chez toi sale enculé'
				}
			]
		}
	];
	let userHistoryDto;
	let error = false;

	// onMount(async () => {
	// 	const resp = await fetch('http://localhost:5000/history/0', { method: 'GET' });

	// 	if (resp.ok) {
	// 		userHistoryDto = await resp.json();
	// 		conversations = [...userHistoryDto.userHistory, ...userHistoryDto.channelHistory];
	// 		console.log('OK');
	// 	} else {
	// 		error = true;
	// 		console.log('PAS OK');
	// 		console.log(resp.status);
	// 		console.log(resp.statusText);
	// 	}
	// });
</script>

<div>
	{#each conversations as conversation}
		<DirectMessages {conversation} image="cars.jpeg" />
	{:else}
		<p>Waiting...</p>
	{/each}
</div>
