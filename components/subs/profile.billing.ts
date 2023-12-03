import type { FormField } from '$liwe3/components/FormCreator.svelte';

const accountFields: FormField[] = [
	{
		name: '',
		label: 'Administration Profile',
		type: 'title',
	},
	{
		name: 'company_name',
		label: 'Company Name',
		type: 'text',
		required: true,
		col: 12,
	},
	{
		name: 'company_address',
		label: 'Address',
		type: 'text',
		required: true,
		col: 10,
	},
	{
		name: 'company_nr',
		label: 'Nr',
		type: 'text',
		required: true,
		col: 2,
	},
	{
		name: 'company_zip',
		label: 'Zip',
		type: 'text',
		required: true,
		col: 4,
	},
	{
		name: 'company_city',
		label: 'City',
		type: 'text',
		required: true,
		col: 6,
	},
	{
		name: 'company_state',
		label: 'State',
		type: 'text',
		required: true,
		col: 2,
	},
	{
		name: 'sdi',
		label: 'SDI',
		type: 'text',
		required: false,
		col: 4,
	},
	{
		name: 'vat',
		label: 'VAT',
		type: 'text',
		required: false,
		col: 4,
	},
	{
		name: 'pec',
		label: 'PEC',
		type: 'email',
		required: false,
		col: 4,
	}

];

export default accountFields;