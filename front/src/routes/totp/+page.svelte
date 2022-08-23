<script lang="ts">
  import { state } from '$lib/ts/state';
  import CodeDial from '$lib/CodeDial.svelte';
</script>

<h1>2FA Code</h1>
<CodeDial submit={state.sendTotpToken.bind(state)}/>
