<script lang="ts">
	import { state } from '$lib/ts/state';
  import { LoginEvent } from 'backFrontCommon';
  import TotpSetup from '$lib/TotpSetup.svelte';
  
  let showTotpSetup = false;

  function enableTotp() {
    showTotpSetup = true;
  }
  
  function disableTotp() {
    state.socket.emit(LoginEvent.TOTP_UPDATE, null);
  }
</script>

{#if !state.myInfo.totpSecret}
  <button on:click={enableTotp}> enable 2fa </button>
{:else}
  <button on:click={disableTotp}> disable 2fa </button>
{/if}

<TotpSetup bind:show={showTotpSetup}/>