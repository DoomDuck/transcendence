import {
	BanUserToServer,
	ChannelInfo,
	ChannelUser,
	ChatEvent,
	ChatFeedbackDto,
	MuteUserToServer,
	type ClientToServerEvents
} from 'backFrontCommon';
import { socket, updateChannel } from '$lib/state';

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

const channelAction = <Key extends keyof ClientToServerEvents>(event: Key) => {
	return <DTO extends Parameters<ClientToServerEvents[Key]>[0] & { channel: string }>(dto: DTO) => {
		const callback = (feedback: ChatFeedbackDto) => {
			if (feedback.success) {
				updateChannel(dto.channel);
			} else {
				alert(feedback.errorMessage);
			}
		};
		socket!.emit(event, ...([dto, callback] as Parameters<ClientToServerEvents[Key]>));
	};
};
export const banUser = channelAction(ChatEvent.BAN_USER);
export const muteUser = channelAction(ChatEvent.MUTE_USER);
// export const unMuteUser = channelAction(ChatEvent.UNMUTE_USER);
