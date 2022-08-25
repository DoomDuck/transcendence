import { ChatEvent, type GameInviteToServer, type Id } from 'backFrontCommon';
import { state } from '$lib/ts/state';
import { PopupCategory, popups, type CanBePopup, popupMethods } from './popups';
import { usersObject } from './users';
import type { GameInviteFromServer } from 'backFrontCommon/chatEvents';

function _modeString(classic: boolean) {
	return (classic ? 'Classic' : 'WeIrD') + ' mode';
}

export class ReceivedGameInvite implements CanBePopup {
	public popupCategory = PopupCategory.WARNING;
	public errorMessage?: string = undefined;
	public text: string;
	private valid: boolean = true;

	constructor(public dto: GameInviteFromServer) {
		this.text = '';
		usersObject.findOrFetch(dto.source).then(({ name }) => {
			if (this.valid) {
				this.text = `You have been invited by ${name} to play (${_modeString(dto.classic)})`;
				popups.update((_) => _);
			}
		});
	}

	get hasButton(): boolean {
		return true;
	}
	get buttonLabel(): string {
		return 'Accept';
	}
	onClose() {
		state.socket.emit(ChatEvent.GAME_REFUSE, { target: this.dto.source });
	}
	onAccept() {
		state.socket.emit(
			ChatEvent.GAME_ACCEPT,
			{ target: this.dto.source },
			({ success, errorMessage }) => {
				if (success) popupMethods.removePopup(this);
				else alert(errorMessage);
			}
		);
	}
	revoke() {
		this.popupCategory = PopupCategory.ERROR;
		this.text = 'Invitation cancelled';
		this.valid = false;
		popups.update((_) => _);
		setTimeout(() => {
			popupMethods.removePopup(this);
		}, 1000);
	}
}

export class SentGameInvite implements CanBePopup {
	public popupCategory = PopupCategory.WARNING;
	public text: string;

	constructor(public dto: GameInviteToServer) {
		this.text = '';
		usersObject.findOrFetch(dto.target).then(({ name }) => {
			this.text = `You have invited ${name}... (${_modeString(dto.classic)})`;
			popups.update((_) => _);
		});
	}

	get hasButton(): boolean {
		return false;
	}
	onClose() {
		state.socket.emit(ChatEvent.GAME_CANCEL, { target: this.dto.target });
	}
}

function revokeReceivedGameInvite(sender: Id) {
	popups.update((_) => {
		const invite = _.find(
			(popup) => popup instanceof ReceivedGameInvite && popup.dto.source == sender
		);
		if (invite !== undefined) (invite as ReceivedGameInvite).revoke();
		return _;
	});
}

function removeSentGameInvite(target: Id) {
	popups.update((_) => {
		const i = _.findIndex((popup) => popup instanceof SentGameInvite && popup.dto.target == target);
		if (i != -1) _.splice(i, 1);
		return _;
	});
}

function sendGameInvite(dto: GameInviteToServer) {
	state.socket.emit(ChatEvent.GAME_INVITE, dto, ({ success, errorMessage }) => {
		if (success) popupMethods.addPopup(new SentGameInvite(dto));
		else alert(errorMessage);
	});
}

function receiveGameInvite(dto: GameInviteFromServer) {
	popupMethods.addPopup(new ReceivedGameInvite(dto));
}

export const gameInviteMethods = {
	send: sendGameInvite,
	receive: receiveGameInvite,
	revokeReceived: revokeReceivedGameInvite,
	removeSent: removeSentGameInvite
};
