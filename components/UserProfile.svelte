<script lang="ts">
	import FormCreator from '$liwe3/components/FormCreator.svelte';
	import Tabs from '$liwe3/components/Tabs.svelte';
	import Tab from '$liwe3/components/sub/Tab.svelte';

	import accountFields from '$modules/user/components/subs/profile.account';
	import passwordFields from '$modules/user/components/subs/profile.password';
	import biographyFields from '$modules/user/components/subs/profile.biography';
	import billingFields from '$modules/user/components/subs/profile.billing';
	import type { User } from '../types';

	export let user: User | null = null;
	export let showAccount = true;
	export let showPassword = true;
	export let showBio = true;
	export let showBilling = true;

	const values = {
		name: user?.name || '',
		lastname: user?.lastname || '',
		phone: user?.phone || '',
		email: user?.email || '',
		address: '',
		nr: '',
		zip: '',
		city: '',
		state: '',
		country: '',
		facebook: user?.facebook || '',
		twitter: user?.twitter || '',
		instagram: user?.instagram || '',
		website: user?.website || '',
		linkedin: user?.linkedin || '',
		youtube: '',
		short_bio: user?.tagline || '',
		bio: user?.bio || '',
		company_name: '',
		company_address: '',
		company_nr: '',
		company_zip: '',
		company_city: '',
		company_state: '',
		company_country: '',
		sdi: '',
		vat: '',
		pec: ''
	};

	const showChange = (e: any) => {
		console.log('=== CHANGE: ', values);
	};

	const doSubmit = (e: any) => {
		console.log('=== SUBMIT: ', values);
	};
</script>

<div class="container">
	<Tabs>
		{#if showAccount}
			<Tab title="Account" id="account">
				<FormCreator
					fields={accountFields}
					{values}
					submitLabel="Update"
					showReset={false}
					on:change={showChange}
					on:submit={doSubmit}
				/>
			</Tab>
		{/if}
		{#if showPassword}
			<Tab title="Password" id="password">
				<FormCreator
					fields={passwordFields}
					{values}
					submitLabel="Update"
					showReset={false}
					on:change={showChange}
					on:submit={doSubmit}
				/>
			</Tab>
		{/if}
		{#if showBio}
			<Tab title="Biography" id="bio">
				<FormCreator
					fields={biographyFields}
					{values}
					submitLabel="Update"
					showReset={false}
					on:change={showChange}
					on:submit={doSubmit}
				/>
			</Tab>
		{/if}
		{#if showBilling}
			<Tab title="Billig Info" id="billing">
				<FormCreator
					fields={billingFields}
					{values}
					submitLabel="Update"
					showReset={false}
					on:change={showChange}
					on:submit={doSubmit}
				/>
			</Tab>
		{/if}
	</Tabs>
</div>

<style>
	.container {
		max-width: 1200px;
	}

	.actions {
		display: flex;
		justify-content: flex-end;

		margin-top: 2rem;
	}
</style>
