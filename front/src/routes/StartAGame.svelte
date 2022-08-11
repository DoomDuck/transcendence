<nav id="start_a_game">
	<h4>
		<a sveltekit:prefetch href="/PlayOnline">Play Online</a>
	</h4>
	<h4>
		<a sveltekit:prefetch href="/PlayOffline">Play Offline</a>
	</h4>
	<h4>
		<a sveltekit:prefetch href="/PlayObserve">Observe</a>
	</h4>
	<h4>
		<a sveltekit:prefetch href="/FriendsList">Challenge a friend</a>
	</h4>
</nav>

<style>
	#start_a_game {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		overflow: hidden;
		width: 100%;
		height: 100%;
		background-image: url('/starsSky.png');
		background-size: cover;
	}

	h4 {
		text-align: center;
		font-family: 'Press start 2P';
		font-style: normal;
		color: #6028ff;
		line-height: 300%;
		-webkit-text-stroke: 1px #ff29ea;
		text-shadow: 5px 5px 5px purple, 5px 5px 5px purple;
		font-size: 3.5vh;
	}

	h4:hover {
		background-color: blue;
		width: 100%;
		text-align: center;
	}

	a {
		all: unset;
	}
</style>
