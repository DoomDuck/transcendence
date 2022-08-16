<script lang="ts">
	let fileInput: HTMLInputElement;
	let files: FileList;
	let avatar: string;

	async function resizeAndSend(blob: Blob) {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		canvas.width = 64;
		canvas.height = 64;
		const img = new Image();
		img.onload = (event) => {
			const size = Math.min(img.width, img.height);
			ctx.drawImage(img, 0, 0, size, size, 0, 0, 64, 64);
			URL.revokeObjectURL(img.src);
			// canvas.toBlob((blob) => {
			//   if (blob === null)
			//     return;
			//   fetch(`http://localhost:5000/user/avatar`, {
			//       method: 'POST',
			//       // headers: {
			//       //     'Content-Type': 'application/json',
			//       //     Accept: 'application/json'
			//       // },
			//       body: blob
			//   })
			//   avatar = blob;
			// })
			avatar = canvas.toDataURL();

			console.log(avatar);
			uploadFunction(avatar);
		};
		img.src = URL.createObjectURL(blob);
	}

	async function uploadFunction(objectURL: string) {
		// const imgData = objectURL.split(',');
		// const data = {
		//   image: imgData[1]
		// }
		// console.log(data);
		await fetch(`http://localhost:5000/user/avatar`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: objectURL
		});
	}
</script>

<div class="container">
	{#if avatar}
		<img id="avatar" src={avatar} alt="avatar" />
	{/if}
	<input
		class="hidden"
		id="file-to-upload"
		type="file"
		accept=".png,.jpg"
		bind:files
		bind:this={fileInput}
		on:change={() => resizeAndSend(files[0])}
	/>
	<button class="upload-btn" on:click={() => fileInput.click()}>Upload</button>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	#avatar {
		border-radius: 99999px;
		height: 128px;
		width: 128px;
		margin-bottom: 10px;
	}

	.hidden {
		display: none;
	}

	.upload-btn {
		width: 128px;
		height: 32px;
		background-color: black;
		font-family: sans-serif;
		color: white;
		font-weight: bold;
		border: none;
	}

	.upload-btn:hover {
		background-color: white;
		color: black;
		outline: black solid 2px;
	}
</style>
