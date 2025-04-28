<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$liwe3/components/Button.svelte';
	import FormCreator from '$liwe3/components/FormCreator.svelte';
	import type { FormField } from '$liwe3/components/FormCreator.svelte';
	import PinInput from '$liwe3/components/PINInput.svelte';
	import LocalizationStore from '$liwe3/stores/LocalizationStore.svelte';
	import { addToast } from '$liwe3/stores/ToastStore.svelte';
	import { user_login, user_login_2fa } from '$modules/user/actions';
	import { UserCircle } from 'svelte-hero-icons';
	import { userStoreUpdate } from '../store.svelte';
	import ForgotPassword from './ForgotPassword.svelte';

	const _ = LocalizationStore._;

	interface LoginProps {
		redirect?: string;
		submitLabel?: string;
		onsuccess?: () => void;
		onerror?: () => void;
	}

	let { redirect = '', submitLabel = _('Login'), onsuccess, onerror }: LoginProps = $props();

	let show2FA = $state(false);
	let code2FA = $state('');
	let forgotPass = $state(false);
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

		userStoreUpdate({
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

		onsuccess && onsuccess();

		if (redirect) {
			goto(redirect);
		}
	};

	const login = async (values: Record<string, string>) => {
		const { username, password } = values;
		const res = await user_login(password, username, undefined, undefined, 'testme');

		if (res.error) {
			addToast({
				type: 'error',
				message: res.error.message
			});

			onerror && onerror();

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
				message: _('Invalid 2FA code')
			});

			onerror && onerror();
			nonce = res.nonce;
			return;
		}

		_do_login(res);
	};

	const forgotPassword = () => {
		forgotPass = !forgotPass;
	};

	const forgotPasswordSuccess = () => {
		forgotPass = false;
		addToast({
			type: 'success',
			message: _('Password updated')
		});
	};
</script>

<div class="login-form">
	{#if !forgotPass}
		{#if !show2FA}
			<FormCreator {fields} showReset={false} onsubmit={login} {submitLabel} />
			<div class="extra-button">
				<Button size="sm" mode="warning" variant="link" onclick={forgotPassword}
					>{_('Forgot password?')}</Button
				>
			</div>
		{:else}
			{_('Insert 2FA code here')}
			<PinInput bind:value={code2FA} />
			<Button onclick={login2FA}>{_('Submit')}</Button>
		{/if}
	{:else}
		<ForgotPassword onsuccess={forgotPasswordSuccess} />
		<div class="extra-button">
			<Button variant="link" mode="warning" size="sm" onclick={forgotPassword}>
				{_('Back to login')}
			</Button>
		</div>
	{/if}
</div>

<style>
	.login-form {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: 0.5rem;
		min-width: 300px;
		max-width: 600px;
		width: 100%;

		/*border: 1px solid #ccc;
		border-radius: 5px;

		font-family: sans-serif;
		*/
	}

	.extra-button {
		height: fit-content;
		/*margin-top: -2rem;*/
	}
</style>
