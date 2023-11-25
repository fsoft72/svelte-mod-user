<script lang="ts">
	import Button from '$liwe3/components/Button.svelte';
	import { _ } from '$liwe3/stores/LocalizationStore';
	import type { Color, Variant } from '$liwe3/types/types';
	import { user_logout } from '../actions';
	import { clearUser } from '../store';

	export let redir: string = '/';
	export let mode: Color = 'error';
	export let variant: Variant = 'solid';

	const doLogout = async () => {
		await user_logout();
		clearUser();
		localStorage.removeItem('token');
		window.location.href = redir;
	};
</script>

<Button {variant} {mode} on:click={() => doLogout()}>{$_('Logout')}</Button>
