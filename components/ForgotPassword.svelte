<script lang="ts">
    import FormCreator from '$liwe3/components/FormCreator.svelte';

    import { user_password_forgot, user_password_reset } from '$modules/user/actions';

    import { onMount } from 'svelte';

    import storeLocalization from '$liwe3/stores/LocalizationStore.svelte';

    import type { FormField } from '$liwe3/components/FormCreator.svelte';

    type PropsType = {
        uac?: string;

        onsuccess?: () => void;
        onerror?: () => void;
    };

    let { uac: _uac, onsuccess, onerror }: PropsType = $props();

    let setPassword: boolean = $state(false);
    let showForm: boolean = $state(true);
    let uiMessage: {type: 'err' | 'msg'; txt: string} = $state({type: 'msg', txt: ''});
    let emailForm: string = $state('');

    const _ = storeLocalization._;

    const passwordFields: FormField[] = [
        {
            name: 'uac',
            label: _('UAC'),
            type: 'text',
            required: true,
        },
        {
            name: 'password',
            label: _('New Password'),
            type: 'password',
            required: true
        },
        {
            name: 'password2',
            label: _('Confirm Password'),
            type: 'password',
            required: true
        }
    ];

    const emailFields: FormField[] = [
        {
            name: 'email',
            label: 'Email',
            type: 'text',
            required: true
        }
    ];

    const handleError = (error: string) => {
        uiMessage = {type: 'err', txt: _(error)};
        setTimeout(() => {
            setPassword = false;
            uiMessage = {type: 'msg', txt: ''};
        } , 3000);
        onerror && onerror();
    };

    const handlePasswordReset = async (data: Record<string, any>) => {
        const err = 'Error resetting password';
        const code = _uac || data.uac;
        const email = emailForm;

        if ( !email ) {
            uiMessage = {type: 'err', txt: _('Email is required')};
            return;
        }

        if ( data.password !== data.password2 ) {
            uiMessage = {type:'err', txt: _('Passwords do not match')};
            return;
        }

        try {
            const res = await user_password_reset( email, code, data.password );

            if (typeof res === 'object') {
                handleError( res?.error.message ?? err );
                return;
            }
            uiMessage = {type: 'msg', txt: _('Password reset successfully')};
            showForm = false;
            onsuccess && onsuccess();
        } catch (error) {
            handleError( err );
        }
    };

    const handleCodeRequest = async (data: Record<string, any>) => {
        const err = 'Error requesting verification code';
        emailForm = data.email;
        try {
            const debugUac = await user_password_forgot(data.email, 'test');

            if (typeof debugUac === 'object' && debugUac !== null) {
                handleError( debugUac?.error.message ?? err );
                return;
            }
            uiMessage = {type: 'msg', txt: _('Check your email for the verification code')};
            setPassword = true;
        } catch (error) {
            handleError( err );
        }
    };

    onMount (() => {
        if (_uac) {
            setPassword = true;
            passwordFields.shift();
        }
    });
</script>
<div class="user-password-reset">
    {#if showForm}
        {#if setPassword}
            <FormCreator
                fields={passwordFields}
                onsubmit={handlePasswordReset}
                submitLabel={_('Set Password')}
                showReset={false}
            />
        {:else}
            <FormCreator
                fields={emailFields}
                onsubmit={handleCodeRequest}
                submitLabel={_('Send Reset Link')}
                showReset={false}
            />
        {/if}
    {/if}
    <div class="ui-message" class:error={uiMessage.type === 'err'}>
        {uiMessage.txt}
    </div>
</div>
<style>
    .user-password-reset {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        width: 100%;
    }

    .ui-message {
        color: var(--liwe3-color);
    }

    .ui-message.error {
        color: var(--liwe3-error-500);
    }
</style>