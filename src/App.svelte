<script>
  import Menu from "./Menu.svelte";
  import StartAGame from './StartAGame.svelte';
  import Chat from './Chat.svelte';
  let status = "menu";

</script>


{#if status == "menu"}
<Menu
  on:start_game="{() => status = "start_a_game"}"
  on:open_chat="{() => status = "chat"}"
/>
{:else if status == "start_a_game"}
<StartAGame/>
{:else}
<Chat on:open_menu="{() =>  status = "menu"}"/>
{/if}