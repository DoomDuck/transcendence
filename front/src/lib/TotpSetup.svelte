<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import { toDataURL } from 'qrcode';
	import { state } from '$lib/ts/state';
	import { LoginEvent } from 'backFrontCommon';
	import { TOTP } from 'otpauth';
	import CodeDial from './CodeDial.svelte';

	export let show: boolean;
	const totp = new TOTP({
		issuer: 'Transcendance',
		label: '2fa'
	});
	let totpQrCode: Promise<string> = toDataURL(totp.toString());

	let code: string;

	function submit(token: string) {
		const success = totp.validate({ token }) == 0;
		if (success) {
			state.socket.emit(LoginEvent.TOTP_UPDATE, totp.secret.hex);
			state.updateMyInfo();
			show = false;
		} else code = '';
	}
</script>

<Modal bind:show>
	{#await totpQrCode then dataUrl}
		<img src={dataUrl} alt="qrcode to flash" />
	{/await}

	<CodeDial {submit} bind:code />
</Modal>
