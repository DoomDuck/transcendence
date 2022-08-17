<script lang="ts">
	import { login } from '$lib/login';
	import { onMount } from 'svelte';

	onMount(login);
</script>

<p>Logging in...</p>
