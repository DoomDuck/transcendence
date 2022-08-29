import {
	BanUserToServer,
	BlockUserToServer,
	ChannelInfo,
	ChannelRights,
	ChannelUser,
	ChatEvent,
	MuteUserToServer,
	type ClientToServerEvents
} from 'backFrontCommon';
import { state } from './state';
import { usersObject } from './users';

// export async function getChannelInfo(channel: string): Promise<ChannelInfo> {
// 	return new Promise((resolve, reject) => {
// 		state.socket.emit(ChatEvent.GET_CHANNEL_INFO, { channel }, (feedback) => {
// 			if (!feedback.success) {
// 				alert(feedback.errorMessage);
// 				reject();
// 			}
// 			resolve(feedback.result!);
// 		});
// 	});
// }

// AIDE POUR DEBUG
export async function getChannelInfo(channel: string): Promise<ChannelInfo> {
	return Promise.resolve({
		users: [
			{
				id: 77080,
				muted: false,
				rights: ChannelRights.ADMIN
			},
			{
				id: 1000,
				muted: false,
				rights: ChannelRights.ADMIN
			},
			{
				id: 1001,
				muted: true,
				rights: ChannelRights.USER
			}
		]
	});
}

export type ChannelDetailsData = {
	me?: ChannelUser;
	others: ChannelUser[];
};

export async function treatChannelInfo(channelInfo: ChannelInfo): Promise<ChannelDetailsData> {
	const myInfo = await usersObject.findOrFetchMyself();
	const i = channelInfo.users.findIndex((user) => user.id == myInfo.id);
	let others: ChannelUser[];
	let me: ChannelUser | undefined;
	if (i != -1) {
		me = channelInfo.users[i];
		others = channelInfo.users.filter((_, j) => j != i);
	} else {
		others = [...channelInfo.users];
	}
	return { me, others };
}

export function banUser(dto: BanUserToServer) {
	state.socket.emit(ChatEvent.BAN_USER, dto, (feedback) => {
		if (!feedback.success) {
			alert(feedback.errorMessage);
		}
	});
}

export function muteUser(dto: MuteUserToServer) {
	state.socket.emit(ChatEvent.MUTE_USER, dto, (feedback) => {
		if (!feedback.success) {
			alert(feedback.errorMessage);
		}
	});
}
