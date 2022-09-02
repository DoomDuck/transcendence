import {
	BanUserToServer,
	ChannelInfo,
	ChannelUser,
	ChatEvent,
	MuteUserToServer
} from 'backFrontCommon';
import { socket } from '$lib/state';

export async function getChannelInfo(channel: string): Promise<ChannelInfo> {
	return new Promise((resolve, reject) => {
		socket!.emit(ChatEvent.GET_CHANNEL_INFO, { channel }, (feedback) => {
			if (!feedback.success) {
				alert(feedback.errorMessage);
				reject();
			}
			resolve(feedback.result!);
		});
	});
}

// AIDE POUR DEBUG
// export async function getChannelInfo(_channel: string): Promise<ChannelInfo> {
// 	return Promise.resolve({
// 		users: [
// 			{
// 				id: 77080,
// 				muted: false,
// 				rights: ChannelRights.ADMIN
// 			},
// 			{
// 				id: 1000,
// 				muted: false,
// 				rights: ChannelRights.ADMIN
// 			},
// 			{
// 				id: 1001,
// 				muted: true,
// 				rights: ChannelRights.USER
// 			}
// 		]
// 	});
// }

export function banUser(dto: BanUserToServer) {
	socket!.emit(ChatEvent.BAN_USER, dto, (feedback) => {
		if (!feedback.success) {
			alert(feedback.errorMessage);
		}
	});
}

export function muteUser(dto: MuteUserToServer) {
	socket!.emit(ChatEvent.MUTE_USER, dto, (feedback) => {
		if (!feedback.success) {
			alert(feedback.errorMessage);
		}
	});
}
