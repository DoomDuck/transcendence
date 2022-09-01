import { BlockUserToServer, ChatEvent } from 'backFrontCommon';
import type {
	ChatFeedbackDto,
	CMToServer,
	CreateChannelToServer,
	DMToServer,
	JoinChannelToServer
} from 'backFrontCommon';
import { channelConvs, userConvs } from './chatUtils';
import { socket } from '$lib/state';

export function sendDirectMessage(message: DMToServer) {
	socket!.emit(ChatEvent.MSG_TO_USER, message, (feedback: ChatFeedbackDto) => {
		if (feedback.success) {
			// userConvs.update((_) => _.addMessageFromMe(message.content, message.target));
		} else {
			alert(`error: ${feedback.errorMessage}`);
		}
	});
}

export function sendCreateChannel(message: CreateChannelToServer) {
	socket!.emit(ChatEvent.CREATE_CHANNEL, message, (feedback: ChatFeedbackDto) => {
		if (feedback.success) {
			channelConvs.update((_) => _.create(message.channel));
		} else {
			alert(`error: ${feedback.errorMessage}`);
		}
	});
}

export function sendChannelMessage(message: CMToServer) {
	socket!.emit(ChatEvent.MSG_TO_CHANNEL, message, (feedback: ChatFeedbackDto) => {
		if (feedback.success) {
			channelConvs.update((_) => _.addMessageFromMe(message.content, message.channel));
		} else {
			alert(`error: ${feedback.errorMessage}`);
		}
	});
}

export function sendJoinChannel(message: JoinChannelToServer) {
	socket!.emit(ChatEvent.JOIN_CHANNEL, message, (feedback: ChatFeedbackDto) => {
		if (feedback.success) {
			channelConvs.update((_) => _.create(message.channel));
		} else {
			alert(`error: ${feedback.errorMessage}`);
		}
	});
}

export function blockUser(dto: BlockUserToServer) {
	socket!.emit(ChatEvent.BLOCK_USER, dto, (feedback) => {
		if (feedback.success) {
			userConvs.update((_) => _.delete(dto.target));
		} else {
			alert(feedback.errorMessage);
		}
	});
}
