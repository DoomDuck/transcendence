<script lang="ts">
  import { toDataURL } from 'qrcode';
	import { state } from '$lib/ts/state';
  import { LoginEvent } from 'backFrontCommon';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
	let totpQrCode : null | Promise<string> = null;

  onMount(() => {
		totpQrCode = new Promise(async r => {
      state.socket.emit(LoginEvent.TOTP_DEMAND_SETUP);
  		const url = await new Promise<string>(r => state.socket.once(LoginEvent.TOTP_SETUP, r));
  		r(await toDataURL(url));
    });
  })
</script>

{#if totpQrCode}
	{#await totpQrCode}
		<p>Fetching token...</p>
	{:then dataUrl} 
    <img src={dataUrl} alt="qrcode to flash"/>
    <button on:click={() => goto("/totp")}> Check </button>
	{/await}
{/if}

