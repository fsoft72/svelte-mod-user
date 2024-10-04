<script lang="ts">
	import FormCreator from '$liwe3/components/FormCreator.svelte';
	import Tabs from '$liwe3/components/Tabs.svelte';
	import Tab from '$liwe3/components/sub/Tab.svelte';

	import accountFields from '$modules/user/components/subs/profile.account';
	import passwordFields from '$modules/user/components/subs/profile.password';
	import biographyFields from '$modules/user/components/subs/profile.biography';
	import billingFields from '$modules/user/components/subs/profile.billing';
	import type { User } from '../types';
	import UserDomainsList from './UserDomainsList.svelte';
	import { onMount } from 'svelte';
	import { user_me } from '../actions';

	interface UserProfileProps {
		showAccount?: boolean;
		showPassword?: boolean;
		showBio?: boolean;
		showBilling?: boolean;
		showDomains?: boolean;
	}

	let {
		showAccount = true,
		showPassword = true,
		showBio = true,
		showBilling = true,
		showDomains = true
	}: UserProfileProps = $props();

	let userFull: User = $state({} as User);

	const values = {
		name: '',
		lastname: '',
		phone: '',
		email: '',
		address: '',
		nr: '',
		zip: '',
		city: '',
		state: '',
		country: '',
		facebook: '',
		twitter: '',
		instagram: '',
		website: '',
		linkedin: '',
		youtube: '',
		short_bio: '',
		bio: '',
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

	onMount(async () => {
		userFull = await user_me();

		if (!userFull) return;

		if ((userFull as any).error) return;

		values.name = userFull.name || '';
		values.lastname = userFull.lastname || '';
		values.phone = userFull.phone || '';
		values.email = userFull.email || '';
		values.facebook = userFull.facebook || '';
		values.twitter = userFull.twitter || '';
		values.instagram = userFull.instagram || '';
		values.website = userFull.website || '';
		values.linkedin = userFull.linkedin || '';
		values.short_bio = userFull.tagline || '';
		values.bio = userFull.bio || '';
	});
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
					onchange={showChange}
					onsubmit={doSubmit}
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
					onchange={showChange}
					onsubmit={doSubmit}
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
					onchange={showChange}
					onsubmit={doSubmit}
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
					onchange={showChange}
					onsubmit={doSubmit}
				/>
			</Tab>
		{/if}
		{#if showDomains}
			<Tab title="Domains" id="domains">
				<UserDomainsList user={userFull!} />
			</Tab>
		{/if}
	</Tabs>
</div>

<style>
	.container {
		max-width: 1200px;
	}
</style>
