<script lang='ts'>
	import { fade } from 'svelte/transition';
	export let message = "blablabla";
	export let author = "Joey";
	export let nextMessage = "ahahah";
	export let nextAuthor = "Flash McQueen";
	export let username = "Flash McQueen";

	function showAuthor(author:string, nextMsg:string, nextAuthor:string){
	  return !nextMsg || nextAuthor !== author;
	}
</script>

<div class="message" class:mine="{author === username}" transition:fade>
	<p class="text">{message}</p>
	{#if showAuthor(author, nextMessage, nextAuthor)}
		<p class="author">{author}</p>
	{/if}
</div>
  
<style>
	.message {
	  margin: 7px 0;
	}
  
	.message p {
	  border-radius: 5px;
	  padding: 5px;
	  background-color: #eaeaea;
	  display: inline-block;
	}
  
	.message.mine {
	  text-align: right;
	}
  
	.message.mine p.text {
	  background-color: #a62824;
	  color: white;
	}
  
	.message p.author {
	  background-color: white;
	  font-size: 0.8em;
	  display: block;
	  text-decoration: none;
	}
</style>