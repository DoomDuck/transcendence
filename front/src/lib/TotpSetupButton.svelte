<script lang="ts">
	import { state } from '$lib/ts/state';
	import { LoginEvent } from 'backFrontCommon';

	function enableTotp() {}

	function disableTotp() {
		state.socket.emit(LoginEvent.TOTP_DEMAND_SETUP);
	}
</script>

{#if !state.myInfo.totpSecret}
	<button on:click={enableTotp}> enable 2fa </button>
{:else}
	<button on:click={disableTotp}> disable 2fa </button>
{/if}

<!-- Modal -->
