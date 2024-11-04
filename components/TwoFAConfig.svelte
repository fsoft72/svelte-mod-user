<script lang="ts">
	import { onMount } from 'svelte';
	import { user_2fa_start, user_2fa_verify, user_init } from '../actions';
	import PinInput from '$liwe3/components/PINInput.svelte';
	import Button from '$liwe3/components/Button.svelte';
	import { addToast } from '$liwe3/stores/ToastStore.svelte';

	let url = $state('');
	let error = $state('');

	let value = $state('');

	const sendValue = async () => {
		const res = await user_2fa_verify(value);

		if (res.error) return;

		addToast({
			type: 'success',
			message: '2FA successfully configured'
		});
	};

	onMount(async () => {
		await user_init();

		const res = await user_2fa_start();

		console.log('=== RES: ', res);

		if (res.error) error = res.error.message;
		else url = res;
	});
</script>

{#if url}
	<div class="container">
		<img src={url} alt="QR Code" />
		<PinInput bind:value />
		<Button on:click={sendValue}>Submit</Button>
	</div>
{:else}
	{error}
{/if}

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	img {
		border: 1px solid var(--liwe3-border-color);
		border-radius: var(--liwe3-border-radius);
		padding: 0.5rem;
		width: 300px;
		height: 300px;
	}
</style>
