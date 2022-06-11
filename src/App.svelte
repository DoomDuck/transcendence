<script lang="ts">
  import Menu from "./Menu.svelte";
  import StartAGame from './StartAGame.svelte';
  import Chat from './Chat.svelte';

  type Status =  "Menu" | "StartAGame" | "Chat";

  let status : Status = "Menu";

  function go_to(place: Status) {
    return () => status = place;
  }

</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.gstatic.com">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link href="https://fonts.googleapis.com/css2?family=Passion+One:wght@900&family=Press+Start+2P&display=swap" rel="stylesheet">
</svelte:head>

{#if status == "Menu"}
<Menu
  on:start_game={go_to("Menu")}
  on:open_chat={go_to("Chat")}
/>
{:else if status == "StartAGame"}
<StartAGame/>
{:else}
<Chat
  on:open_menu={go_to("Menu")}
/>
{/if}