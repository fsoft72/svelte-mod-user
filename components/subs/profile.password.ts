import type { FormField } from '$liwe3/components/FormCreator.svelte';

const accountFields: FormField[] = [
	{
		name: 'current_password',
		label: 'Current Password',
		type: 'password',
		required: true,
		col: 8,
	},
	{
		name: 'new_password_1',
		label: 'New Password',
		type: 'password',
		required: true,
		col: 8,
	},
	{
		name: 'new_password_2',
		label: 'Confirm New Password',
		type: 'password',
		required: false,
		col: 8,
	},

];

export default accountFields;