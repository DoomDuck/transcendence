<script lang="ts">
	import { myInfo, disableTotp } from '$lib/state';
	import TotpSetup from '$lib/TotpSetup.svelte';

	let showTotpSetup = false;

	function enableTotp() {
		showTotpSetup = true;
	}
</script>

{#if !$myInfo.totpSecret}
	<button on:click={enableTotp}> enable 2fa </button>
{:else}
	<button on:click={disableTotp}> disable 2fa </button>
{/if}
<TotpSetup bind:show={showTotpSetup} />
