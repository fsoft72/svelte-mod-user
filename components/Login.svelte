<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$liwe3/components/Button.svelte';
	import FormCreator from '$liwe3/components/FormCreator.svelte';
	import type { FormField } from '$liwe3/components/FormCreator.svelte';
	import PinInput from '$liwe3/components/PINInput.svelte';
	import { _ } from '$liwe3/stores/LocalizationStore';
	import { addToast } from '$liwe3/stores/ToastStore';
	import { user_login, user_login_2fa } from '$modules/user/actions';
	import { UserCircle } from 'svelte-hero-icons';
	import { initUser } from '../store';

	export let redirect = '';
	export let submitLabel = $_('Login');

	let show2FA = false;
	let code2FA = '';
	let nonce = '';
	let id_user = '';

	let fields: FormField[] = [
		{
			name: 'username',
			label: 'Username / Email',
			type: 'text',
			required: true,
			icon: UserCircle
		},
		{
			name: 'password',
			label: 'Password',
			type: 'password',
			required: true
		}
	];

	const _do_login = (res: any) => {
		console.log('=== DO LOGIN: ', res);
		initUser({
			uid: res.id || res.id_user,
			name: `${res.name} ${res.lastname}`,
			perms: res.perms,
			email: res.email,
			token: res.access_token,
			username: res.username
		});

		addToast({
			type: 'success',
			message: 'Login successfull'
		});

		if (redirect) {
			goto(redirect);
		}
	};

	const login = async (e: CustomEvent) => {
		const { username, password } = e.detail;
		const res = await user_login(password, username, undefined, undefined, 'testme');

		if (res.error) {
			addToast({
				type: 'error',
				message: res.error.message
			});

			return;
		}

		if (res.nonce) {
			show2FA = true;
			nonce = res.nonce;
			id_user = res.id;
			return;
		}

		_do_login(res);
	};

	const login2FA = async () => {
		const res = await user_login_2fa(id_user, code2FA, nonce);

		if (res.error) return;

		if (res.nonce) {
			addToast({
				type: 'error',
				message: $_('Invalid 2FA code')
			});

			nonce = res.nonce;
			return;
		}

		_do_login(res);
	};
</script>

<div class="login-form">
	{#if !show2FA}
		<FormCreator {fields} showReset={false} on:submit={login} {submitLabel} />
		<p>{$_('Forgot password?')}</p>
	{:else}
		{$_('Insert 2FA code here')}
		<PinInput bind:value={code2FA} />
		<Button on:click={login2FA}>{$_('Submit')}</Button>
	{/if}
</div>

<style>
	.login-form {
		width: 500px;
		max-width: 600px;
		padding: 20px;

		/*border: 1px solid #ccc;
		border-radius: 5px;

		font-family: sans-serif;
		*/
	}
</style>
