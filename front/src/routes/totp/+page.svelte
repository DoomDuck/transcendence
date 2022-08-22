<script lang="ts">
  import { getSocket, LOGGIN_SUCCESS_ROUTE } from '$lib/login';
  import { goto } from '$app/navigation';
  import type { ChatSocket } from '$lib/utils';
  import { LoginEvent } from 'backFrontCommon';
  import { onMount } from 'svelte';
  const CODE_LENGTH = 6;

  let code : string = "";
  let socket!: ChatSocket;

  onMount(async () => {
    code = "";
    socket = await getSocket()
  });
  
  async function updateCode(ev: KeyboardEvent) {
    if (ev.key == "Backspace") {
      code = code.slice(0, code.length - 1);
      return;
    }
    if (ev.key.match(/^\d$/)) {
      code = code + ev.key;
    }
    if (code.length == CODE_LENGTH) {
      await submit(code);
    }
  }
  
  async function submit(code: string) {
    console.log("Submitting..");
    socket.emit(LoginEvent.TOTP_CHECK, code);
    const success = await new Promise<boolean>(r => socket.once(LoginEvent.TOTP_RESULT, r));
    goto(success ? LOGGIN_SUCCESS_ROUTE : '/');
  }
</script>

<svelte:window on:keydown="{updateCode}"/>

<div id=background>
  <h1>Code please</h1>
  <h1>{code.padEnd(CODE_LENGTH, '_').split('').join(' ')}</h1>
</div>

<style>
	#background {
		background-image: url('/starsSky.png');
		background-size: cover;
		width: 100%;
		height: 100%;
		overflow: hidden;

		display: flex;
		flex-direction: column;
		align-items: center;
    justify-content: center;
	}

	/* Typographie */ 
	h1 {
		font-family: 'Press Start 2P';
		font-style: normal;
		color: #6028FF;
		line-height: 300%;
		-webkit-text-stroke: 2px #ff29ea;
		text-shadow: 6px 6px 6px purple, 6px 6px 6px purple;
		font-size: 4vh;
	}
</style>