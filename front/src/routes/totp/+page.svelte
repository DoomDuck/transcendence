<script lang="ts">
  import { state } from '$lib/state';
  const CODE_LENGTH = 6;

  let code : string = "";
  let verifying: boolean = false;
  
  function updateCode(ev: KeyboardEvent) {
    if (ev.key == "Backspace")
      code = code.slice(0, code.length - 1);

    if (code.length == CODE_LENGTH)
      return;

    if (ev.key.match(/^\d$/)) {
      code = code + ev.key;
      if (code.length == CODE_LENGTH) submit();
    }
  }
        
  function submit() {
    state.sendTotpToken(code);
    verifying = true;
  }
</script>

<svelte:window on:keydown={updateCode}/>


<h1>2FA Code</h1>
{#if verifying}
  <h1>Verifying..</h1>
{:else}
  <h1>{code.padEnd(CODE_LENGTH, '_').split('').join(' ')}</h1>
{/if}
