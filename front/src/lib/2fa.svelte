<script lang="ts">
  import { toDataURL } from 'qrcode';
  import { getSocket } from '$lib/login';
  import { onMount } from 'svelte';
  import type { ChatSocket } from '$lib/utils';
  import { LoginEvent } from 'backFrontCommon';
  
  
  let socket: ChatSocket;
  let token : null | string = null;
  onMount(async () => {
    socket = await getSocket();
    socket.on(LoginEvent.TOTP_URI, t => token = t)
  });
</script>

{#if !token}
  <p>Fetching token...</p>
{:else}
  {#await toDataURL(token)}
    <p>Generating QR code...</p>
  {:then dataUrl}
    <img src={dataUrl} alt="qrcode to flash"/>
  {/await}
{/if}

