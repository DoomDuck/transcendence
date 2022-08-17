<script lang="ts">
	export let optionOne = '';
	export let optionTwo = '';
	let mode = optionOne;

	function toggleMode() {
		if (mode == optionOne) mode = optionTwo;
		else mode = optionOne;
	}

	$: let a = b;
</script>

<div class="SwitchContainer">
	<label class="switch">
		<input type="checkbox" on:click={toggleMode} />
		<span class="slider round" />
	</label>
	{mode}
</div>

<style>
	.switch {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
	}

	.SwitchContainer {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	input:checked + .slider {
		background-color: #2196f3;
	}

	input:focus + .slider {
		box-shadow: 0 0 1px #2196f3;
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(26px);
		-ms-transform: translateX(26px);
		transform: translateX(26px);
	}

	.slider.round {
		border-radius: 34px;
	}

	.slider.round:before {
		border-radius: 50%;
	}
</style>
