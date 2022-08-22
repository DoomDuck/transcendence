<script lang="ts">
  import { toDataURL } from 'qrcode';
  // import { onMount } from 'svelte';
  // import { getSocket } from '$lib/login';
  // import type { ChatSocket } from '$lib/utils';
  
  let uri: null | string = null;
  // let socket: ChatSocket;
  // onMount(async () => {
  //   socket = await getSocket();
  // });
</script>

{#if !uri}
  <p>Fetching URI...</p>
{:else}
  {#await toDataURL(uri)}
    <p>Generating QR code...</p>
  {:then dataUrl}
    <img src={dataUrl} alt="qrcode to flash"/>
  {/await}
{/if}


