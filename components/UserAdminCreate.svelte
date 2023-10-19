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
			size: 'md'
		},
		{
			name: 'email',
			label: 'Email',
			type: 'email',
			required: true,
			placeholder: 'Email',
			size: 'md'
		},
		{
			name: 'name',
			label: 'Name',
			type: 'text',
			required: false,
			placeholder: 'Name',
			size: 'md'
		},
		{
			name: 'lastname',
			label: 'Lastname',
			type: 'text',
			required: false,
			placeholder: 'Lastname',
			size: 'md'
		},
		{
			name: 'group',
			label: 'group',
			type: 'text',
			required: false,
			placeholder: 'group',
			size: 'md'
		},
		{
			name: 'enabled',
			label: 'Enabled',
			type: 'checkbox',
			required: false,
			size: 'md'
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
