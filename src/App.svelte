<script>
  import Menu from "./Menu.svelte";
  import StartAGame from './StartAGame.svelte';
  let status = "menu";

</script>


{#if status == "menu"}
<Menu
  on:start_game="{() => status = "start_a_game"}"
/>
{:else}
<StartAGame/>
{/if}