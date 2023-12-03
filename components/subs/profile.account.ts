import type { FormField } from '$liwe3/components/FormCreator.svelte';

const accountFields: FormField[] = [
	{
		name: '',
		type: 'title',
		label: 'Personal Information',
	},
	{
		name: 'name',
		label: 'Name',
		type: 'text',
		required: true,
		col: 6,
	},
	{
		name: 'lastname',
		label: 'Lastname',
		type: 'text',
		required: true,
		col: 6,
	},
	{
		name: 'phone',
		label: 'Phone',
		type: 'tel',
		required: false,
		col: 6,
	},
	{
		name: 'email',
		label: 'Email',
		type: 'email',
		required: true,
		col: 6,
	},
	// Address
	{
		name: '',
		type: 'title',
		label: 'Address',
	},
	{
		name: 'address',
		label: 'Address',
		type: 'text',
		required: false,
		col: 8,
	},
	{
		name: 'nr',
		label: 'Nr',
		type: 'text',
		required: false,
		col: 4,
	},
	{
		name: 'zip',
		label: 'Zip',
		type: 'text',
		required: false,
		col: 2,
	},
	{
		name: 'city',
		label: 'City',
		type: 'text',
		required: false,
		col: 6,
	},
	{
		name: 'state',
		label: 'State',
		type: 'text',
		required: false,
		col: 4,
	},
	// Social References
	{
		name: '',
		type: 'title',
		label: 'Social References',
	},
	{
		name: 'facebook',
		label: 'Facebook',
		type: 'text',
		required: false,
		col: 6,
	},
	{
		name: 'twitter',
		label: 'Twitter',
		type: 'text',
		required: false,
		col: 6,
	},
	{
		name: 'instagram',
		label: 'Instagram',
		type: 'text',
		required: false,
		col: 6,
	},
	{
		name: 'linkedin',
		label: 'Linkedin',
		type: 'text',
		required: false,
		col: 6,
	},
	{
		name: 'youtube',
		label: 'Youtube',
		type: 'text',
		required: false,
		col: 6,
	},
	{
		name: 'website',
		label: 'Website',
		type: 'text',
		required: false,
		col: 6,
	},

];

export default accountFields;