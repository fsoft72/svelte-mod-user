<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { userStoreClear, storeUser } from '../store.svelte';

	// Props
	let { timeout = 300, onlogout = () => {} } = $props();

	let timeoutId: any = $state(null);
	let isActive = $state(true);

	// Events to listen for user activity
	const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

	function resetTimer() {
		// Clear existing timeout
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		// Set new timeout
		timeoutId = setTimeout(() => {
			isActive = false;
			onlogout();
		}, timeout * 1000);

		isActive = true;
	}

	function handleActivity() {
		resetTimer();
	}

	onMount(() => {
		if (storeUser.uid) {
			console.log('=== AUTOLOGOUT INIT');
			// Start the timer when component mounts
			resetTimer();

			// Add event listeners for user activity
			events.forEach((event) => {
				document.addEventListener(event, handleActivity, true);
			});
		}
	});

	onDestroy(() => {
		// Clean up timeout
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		// Remove event listeners
		events.forEach((event) => {
			document.removeEventListener(event, handleActivity, true);
		});
	});

	// Expose method to manually reset timer
	export function resetAutoLogout() {
		resetTimer();
	}

	// Expose current active state
	export function getIsActive() {
		return isActive;
	}
</script>

<!-- This component doesn't render anything visible -->
<div style="display: none;"></div>
