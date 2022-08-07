<script>
	import DirectMessages from './DirectMessages.svelte';
	import { onMount } from 'svelte';

	// type ConversationHistory = {
	//   id: Number,
	//   chatMessage: {
	//     sender: id,
	//     content: string
	//   }
	// }
	// let openConversations = [
	//   {
	//     name: "Flash McQueen",
	//     image: "cars.jpeg",
	//     hasNewMessage: true
	//   },
	//   {
	//     name: "Joey",
	//     image: "canard.jpeg",
	//     hasNewMessage: true
	//   },
	// ];
	let openConversations = [];
	let userHistoryDto;
	let error = false;
	// onMount(async () => {
	// 	const reponse = await fetch('http://localhost:5000/user', {
	// 		method: 'GET'
	// 	});

	// 	const result = await reponse.json();

	// 	console.log(result);
	// });
	onMount(async () => {
		const resp = await fetch('http://localhost:5000/history/0', { method: 'GET' });

		if (resp.ok) {
			userHistoryDto = await resp.json();
			openConversations = [...userHistoryDto.userHistory, ...userHistoryDto.channelHistory];
			console.log('OK');
		} else {
			error = true;
			console.log('PAS OK');
			console.log(resp.status);
			console.log(resp.statusText);
		}
	});
</script>

<div>
	{#each openConversations as openConversation}
		<DirectMessages name={openConversation.id.toString()} image="cars.jpeg" />
	{:else}
		<p>Waiting...</p>
	{/each}
</div>
