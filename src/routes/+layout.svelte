<script>
	import { onMount } from 'svelte';
	import Desktop from "../components/Desktop.svelte";
	import MobileShell from "../components/MobileShell.svelte";
	import "../app.css";

	let isMobile = false;

	function updateIsMobile() {
		isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
	}

	onMount(() => {
		updateIsMobile();
		window.addEventListener('resize', updateIsMobile);
		return () => window.removeEventListener('resize', updateIsMobile);
	});
</script>

{#if isMobile}
	<MobileShell />
{:else}
	<Desktop />
{/if}
