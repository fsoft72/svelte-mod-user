<script lang="ts">
	import { onMount } from 'svelte';

	import type { FormField } from '$liwe3/components/FormCreator.svelte';
	import FormCreator from '$liwe3/components/FormCreator.svelte';
	import { system_domains_list } from '$modules/system/actions';
	import { has_perm } from '$liwe3/utils/utils';
	import { storeUser } from '../store.svelte';

	interface Props {
		targetUser: any;

		// events
		onuser: (user: Record<string, any>) => void;
	}

	let { targetUser, onuser }: Props = $props();

	let isReady = $state(false);

	const fields: FormField[] = [
		{
			name: 'id',
			label: 'ID',
			type: 'hidden',
			required: false,
		},
		{
			name: 'username',
			label: 'Username',
			type: 'text',
			required: true,
			placeholder: 'Username',
			size: 'md',
			col: 6,
		},
		{
			name: 'email',
			label: 'Email',
			type: 'email',
			required: true,
			placeholder: 'Email',
			size: 'md',
			col: 6,
		},
		{
			name: 'name',
			label: 'Name',
			type: 'text',
			required: false,
			placeholder: 'Name',
			size: 'md',
			col: 6,
		},
		{
			name: 'lastname',
			label: 'Lastname',
			type: 'text',
			required: false,
			placeholder: 'Lastname',
			size: 'md',
			col: 6,
		},
		{
			name: 'password',
			label: 'Password',
			type: 'password',
			required: false,
			placeholder: 'Password',
			size: 'md',
			col: 6,
		},
		{
			name: 'group',
			label: 'group',
			type: 'text',
			required: false,
			placeholder: 'group',
			size: 'md',
			col: 6,
		},
		{
			name: 'enabled',
			label: 'Enabled',
			type: 'checkbox',
			required: false,
			size: 'md',
		},
		{
			name: 'domain',
			label: 'Domain',
			type: 'select',
			required: false,
			default: 'default',
			perms: ['system.domain'],
			options: [
				{ value: 'default', label: 'Default' },
				{ value: 'admin', label: 'Admin' },
			],
			size: 'md',
			col: 6,
		},
	];

	onMount(async () => {
		const options: { value: string; label: string }[] = [];

		if (has_perm(storeUser, 'system.domain')) {
			const domains = await system_domains_list();
			console.log('=== DOMAINS: ', domains);

			// create a value / label pair for each domain
			domains.forEach((domain: any) => {
				options.push({
					value: domain.code,
					label: domain.name,
				});
			});

			// add the options to the domain field
			const domainField = fields.find((f) => f.name === 'domain');
			if (domainField) domainField.options = options;
		}
		isReady = true;
	});
</script>

<div class="container">
	{#if isReady}
		<FormCreator {fields} values={targetUser} onsubmit={onuser} />
	{/if}
</div>

<style>
</style>
