import { ChatEvent } from 'backFrontCommon';
import { state } from './state';

export function resize(imageDataURL: string, width: number, height: number): Promise<string> {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		canvas.width = width;
		canvas.height = height;
		const img = new Image();
		img.src = imageDataURL;
		img.onload = () => {
			const imgRatio = img.width / img.height;
			const targetRatio = width / height;
			let cropWidth = img.width;
			let cropHeight = img.height;
			if (targetRatio < imgRatio) cropHeight = img.width / targetRatio;
			else cropWidth = img.height * targetRatio;
			const sx = (img.width - cropWidth) / 2;
			const sy = (img.height - cropHeight) / 2;
			ctx.drawImage(img, sx, sy, cropWidth, cropHeight, 0, 0, width, height);
			console.log(img.width, img.height, cropWidth, cropHeight);
			URL.revokeObjectURL(img.src);
			resolve(canvas.toDataURL());
		};
		img.onerror = reject;
	});
}

export async function uploadAvatar(imageDataUrl: string) {
	state.socket.emit(ChatEvent.POST_AVATAR, { imageDataUrl }, (feedback) => {
		alert(JSON.stringify(feedback));
	});
	// await fetch(`http://localhost:5000/user/avatar`, {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		Accept: 'application/json'
	// 	},
	// 	body: imageDataUrl
	// });
}
