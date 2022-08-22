<script lang="ts">
  import { getSocket } from '$lib/login';
  import { onMount } from 'svelte';
  import type { ChatSocket } from '$lib/utils';
  import { LoginEvent } from 'backFrontCommon';
  import { TOTP } from 
  
  
  let socket: ChatSocket;
  let token: null | string = null;
  onMount(async () => {
    socket = await getSocket();
    socket.on(LoginEvent.TOTP_URI, t => token = t)
  });
</script>

{#if !token}
{:else}
  {#await toDataURL(token)}
    <p>Generating QR code...</p>
  {:then dataUrl}
    <img src={dataUrl} alt="qrcode to flash"/>
  {/await}
{/if}

