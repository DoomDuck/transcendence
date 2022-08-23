<script>
	import Popups from '$lib/Popups.svelte';
	import { popupMethods } from '$lib/ts/popups';
	import { ReceivedGameInvite, SentGameInvite } from '$lib/ts/gameInvite';
	popupMethods.addPopup(new ReceivedGameInvite(0));
	popupMethods.addPopup(new SentGameInvite(1));
</script>

<Popups />
<slot />
