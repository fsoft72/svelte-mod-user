<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { FormField } from '$liwe3/components/FormCreator.svelte';
	import FormCreator from '$liwe3/components/FormCreator.svelte';

	export let user: any = null;

	const dispatch = createEventDispatcher();

	const fields: FormField[] = [
		{
			name: 'id',
			label: 'ID',
			type: 'hidden',
			required: true
		},
		{
			name: 'username',
			label: 'Username',
			type: 'text',
			required: true,
			placeholder: 'Username',
			size: 'md',
			col: 6
		},
		{
			name: 'email',
			label: 'Email',
			type: 'email',
			required: true,
			placeholder: 'Email',
			size: 'md',
			col: 6
		},
		{
			name: 'name',
			label: 'Name',
			type: 'text',
			required: false,
			placeholder: 'Name',
			size: 'md',
			col: 6
		},
		{
			name: 'lastname',
			label: 'Lastname',
			type: 'text',
			required: false,
			placeholder: 'Lastname',
			size: 'md',
			col: 6
		},
		{
			name: 'password',
			label: 'Password',
			type: 'password',
			required: false,
			placeholder: 'Password',
			size: 'md',
			col: 6
		},
		{
			name: 'group',
			label: 'group',
			type: 'text',
			required: false,
			placeholder: 'group',
			size: 'md',
			col: 6
		},
		{
			name: 'enabled',
			label: 'Enabled',
			type: 'checkbox',
			required: false,
			size: 'md'
		},
		{
			name: 'domain',
			label: 'Domain',
			type: 'select',
			required: true,
			default: 'default',
			options: [
				{ value: 'default', label: 'Default' },
				{ value: 'admin', label: 'Admin' }
			],
			size: 'md',
			col: 6
		}
	];

	const onSubmit = (data: any) => {
		dispatch('user', data);
	};
</script>

<div class="container">
	<FormCreator {fields} values={user} on:submit={(e) => onSubmit(e.detail)} />
</div>

<style>
</style>
