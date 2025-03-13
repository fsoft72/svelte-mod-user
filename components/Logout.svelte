<script lang="ts">
	import Button from '$liwe3/components/Button.svelte';
	import LocalizationStore from '$liwe3/stores/LocalizationStore.svelte';
	import type { Color, Variant } from '$liwe3/types/types';
	import { user_logout } from '../actions';
	import { userStoreClear } from '../store.svelte';

	const _ = LocalizationStore._;
	interface LogoutProps {
		redir?: string;
		mode?: Color;
		variant?: Variant;
	}

	let { redir = '/', mode = 'error', variant = 'solid' }: LogoutProps = $props();

	const doLogout = async () => {
		await user_logout();
		userStoreClear();
		localStorage.removeItem('token');
		window.location.href = redir;
	};
</script>

<Button {variant} {mode} onclick={() => doLogout()}>{ _('Logout')}</Button>
