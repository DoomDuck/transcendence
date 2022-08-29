import {
	BlockUserToServer,
	ChatEvent,
	type ChatFeedbackDto,
	type CMToServer,
	type CreateChannelToServer,
	type DMToServer,
	type JoinChannelToServer
} from 'backFrontCommon';
import { channelConvs } from './chatUtils';
import { state } from './state';

function sendDirectMessage(message: DMToServer) {
	state.socket.emit(ChatEvent.MSG_TO_USER, message, (feedback: ChatFeedbackDto) => {
		if (feedback.success) {
			// userConvs.update((_) => _.addMessageFromMe(message.content, message.target));
		} else {
			alert(`error: ${feedback.errorMessage}`);
		}
	});
}

function sendCreateChannel(message: CreateChannelToServer) {
	state.socket.emit(ChatEvent.CREATE_CHANNEL, message, (feedback: ChatFeedbackDto) => {
		if (feedback.success) {
			channelConvs.update((_) => _.create(message.channel));
		} else {
			alert(`error: ${feedback.errorMessage}`);
		}
	});
}

function sendChannelMessage(message: CMToServer) {
	state.socket.emit(ChatEvent.MSG_TO_CHANNEL, message, (feedback: ChatFeedbackDto) => {
		if (feedback.success) {
			channelConvs.update((_) => _.addMessageFromMe(message.content, message.channel));
		} else {
			alert(`error: ${feedback.errorMessage}`);
		}
	});
}

function sendJoinChannel(message: JoinChannelToServer) {
	state.socket.emit(ChatEvent.JOIN_CHANNEL, message, (feedback: ChatFeedbackDto) => {
		if (feedback.success) {
			channelConvs.update((_) => _.create(message.channel));
		} else {
			alert(`error: ${feedback.errorMessage}`);
		}
	});
}

export function blockUser(dto: BlockUserToServer) {
	state.socket.emit(ChatEvent.BLOCK_USER, dto, (feedback) => {
		if (!feedback.success) {
			alert(feedback.errorMessage);
		}
	});
}

export const chatMethods = {
	sendDirectMessage,
	sendCreateChannel,
	sendChannelMessage,
	sendJoinChannel
};
