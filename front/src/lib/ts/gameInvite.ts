import { ChatEvent, type ChatUserDto, type Id } from 'backFrontCommon';
import { writable, type Writable } from 'svelte/store';
import { state } from '$lib/ts/state';
import { usersObject } from './users';

export type GameInviteDto = {
	sender: Id;
	senderName: string;
	valid: boolean;
	errorMessage?: string;
};

let _invits: GameInviteDto[] = [];
export const invits: Writable<GameInviteDto[]> = writable([]);
invits.subscribe((_) => (_invits = _));

function findBySender(sender: Id): GameInviteDto | undefined {
	return _invits.find((invite) => invite.sender == sender);
}

function removeByReference(_invite: GameInviteDto) {
	invits.update((_) => _.filter((invite) => invite !== _invite));
}

function removeBySender(sender: Id) {
	invits.update((_) => _.filter((invite) => invite.sender != sender));
}

function removeByIndex(i: number) {
	invits.update((_) => _.splice(i, 1));
}

function add(sender: Id) {
	removeBySender(sender);
	usersObject.findOrFetch(sender).then((user: ChatUserDto) =>
		invits.update((_) =>
			_.concat({
				sender,
				senderName: user.name,
				valid: true
			})
		)
	);
}

function revoke(sender: Id, errorMessage: string) {
	const invite = findBySender(sender);
	console.log('FOUND ', invite);
	if (invite === undefined) return;
	invite.valid = false;
	invite.errorMessage = errorMessage;
	invits.update((_) => _);
	setTimeout(() => {
		removeByReference(invite);
		console.log('AH ', invite);
	}, 1000);
}

function accept(sender: Id) {
	state.socket.emit(
		// 'Response' game invite
		ChatEvent.GAME_INVITE,
		{ target: sender },
		() => removeBySender(sender) // feedback
	);
}

export const gameInvitsMethods = {
	add,
	revoke,
	accept,
	removeByIndex
};

// DEBUG
// add(0);
// add(1);
