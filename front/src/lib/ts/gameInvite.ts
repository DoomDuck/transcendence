import { ChatEvent, type Id } from 'backFrontCommon';
import { getSocket } from './login';
import { PopupCategory, popups, type CanBePopup, popupMethods } from './popups';
import { usersObject } from './users';

export class ReceivedGameInvite implements CanBePopup {
	public popupCategory = PopupCategory.WARNING;
	public errorMessage?: string = undefined;
	public text: string;
	private valid: boolean = true;

	constructor(public sender: Id) {
		this.text = '';
		usersObject.findOrFetch(sender).then(({ name }) => {
			if (this.valid) {
				this.text = `You have been invited by ${name} to play`;
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
		getSocket().then((socket) => {
			socket.emit(ChatEvent.GAME_REFUSE, { target: this.sender });
		});
	}
	onAccept() {
		getSocket().then((socket) => {
			socket.emit(ChatEvent.GAME_ACCEPT, { target: this.sender }, () =>
				popupMethods.removePopup(this)
			);
		});
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

	constructor(public target: Id) {
		this.text = '';
		usersObject.findOrFetch(target).then(({ name }) => {
			this.text = `You have invited ${name}...`;
			popups.update((_) => _);
		});
	}

	get hasButton(): boolean {
		return false;
	}
	onClose() {
		getSocket().then((socket) => {
			socket.emit(ChatEvent.GAME_REFUSE, { target: this.target });
		});
	}
}

function revokeReceivedGameInvite(sender: Id) {
	popups.update((_) => {
		const invite = _.find((popup) => popup instanceof ReceivedGameInvite && popup.sender == sender);
		if (invite !== undefined) (invite as ReceivedGameInvite).revoke();
		return _;
	});
}

function sendGameInvite(target: Id) {
	getSocket().then((socket) => {
		socket.emit(ChatEvent.GAME_INVITE, { target }, () =>
			popupMethods.addPopup(new SentGameInvite(target))
		);
	});
}

function receiveGameInvite(source: Id) {
	popupMethods.addPopup(new ReceivedGameInvite(source));
}

export const gameInviteMethods = {
	send: sendGameInvite,
	receive: receiveGameInvite,
	revokeReceivedGameInvite
};
