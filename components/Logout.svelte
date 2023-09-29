<script lang="ts">
	import Button from '$liwe3/components/Button.svelte';
	import { _ } from '$liwe3/stores/LocalizationStore';
	import { user_logout } from '../actions';
	import { clearUser } from '../store';

	export let redir: string = '/';

	const doLogout = async () => {
		await user_logout();
		clearUser();
		localStorage.removeItem('token');
		window.location.href = redir;
	};
</script>

<Button variant="outline" mode="danger" on:click={() => doLogout()}>{$_('Logout')}</Button>
