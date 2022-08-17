<script lang="ts">
	export let imageURL: string;
</script>

<img class="rounded-image" src={imageURL} alt="contact" />

<style>
	.rounded-image {
		overflow: hidden;
		-webkit-border-radius: 50px;
		/* -moz-border-radius: 50px; */
		border-radius: 30px;
		width: 60px;
		height: 60px;
		margin-left: 1%;
		margin-right: 2%;
		margin-top: auto;
		margin-bottom: auto;
	}
</style>
