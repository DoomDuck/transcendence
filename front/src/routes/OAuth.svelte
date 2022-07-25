<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		let params = new URLSearchParams(document.location.search);

		let code = params.get('code');
		if (code) goto('Main');
	});

	function on_click() {
		const LOCATION = 'https://api.intra.42.fr/oauth/authorize';
		const REDIRECT = encodeURIComponent(window.location.origin);
		const CLIENT_ID = (window as any).env.PUBLIC_42_APP_ID as string;
		const URL = `${LOCATION}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT}&response_type=code`;

		window.history.pushState({}, '');
		window.location.assign(URL);
	}
</script>

<button on:click={on_click}> Connect </button>

<div />
