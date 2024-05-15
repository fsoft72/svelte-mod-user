<script lang="ts">
	import { onMount } from 'svelte';
	import type { User, UserDomain } from '../types';
	import Spinner from '$liwe3/components/Spinner.svelte';
	import { user_domain_invitation_accept, user_domains_list } from '../actions';
	import DataGrid, { type GridDataRow, type GridField } from '$liwe3/components/DataGrid.svelte';
	import Button from '$liwe3/components/Button.svelte';
	import Modal from '$liwe3/components/Modal.svelte';
	import { _ } from '$liwe3/stores/LocalizationStore';
	import { addToast } from '$liwe3/stores/ToastStore.svelte';

	export let user: User | null;

	let is_ready = false;
	let domains: GridDataRow[] = [];
	let showDomainDialog = false;
	let inv = '';

	const fields: GridField[] = [
		{
			name: 'id',
			label: 'ID',
			type: 'text',
			hidden: true
		},
		{
			name: 'name',
			label: 'Name',
			type: 'text'
		},
		{
			name: 'preferred',
			label: 'Preferred',
			type: 'boolean'
		}
	];

	const domainsUpdate = async () => {
		const res = await user_domains_list();
		if (res.error) return res;

		domains = res.map((d: UserDomain) => {
			return {
				id: d.id_domain,
				name: d.name,
				preferred: d.preferred
			};
		});
	};

	const addDomain = async () => {
		const res = await user_domain_invitation_accept(inv);

		if (res.error) return;

		await domainsUpdate();

		addToast({
			type: 'success',
			message: $_('Domain added successfully')
		});
	};

	onMount(async () => {
		console.log('=== user: ', user);

		await domainsUpdate();

		is_ready = true;
	});
</script>

{#if user?.id && is_ready}
	<div class="container">
		<div class="buttons">
			<Button size="sm" mode="mode2" on:click={() => (showDomainDialog = true)}>Add Domain</Button>
		</div>
		<DataGrid {fields} data={domains} />
	</div>
{:else}
	<Spinner />
{/if}

{#if showDomainDialog}
	<Modal
		title="Add Domain"
		on:close={() => {
			showDomainDialog = false;
		}}
		on:cancel={() => {
			showDomainDialog = false;
		}}
	>
		<div class="inv">
			{$_('Paste your domain invitation here:')}

			<textarea class="textarea" placeholder="Textarea" rows="5" bind:value={inv} />

			<Button size="sm" mode="mode2" on:click={addDomain}>{$_('Add Domain')}</Button>
		</div>
	</Modal>
{/if}

<style>
	.buttons {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 0.5rem;
	}

	.inv {
		display: flex;
		flex-direction: column;
	}

	.inv textarea {
		margin: 0.5rem 0;
		font-family: monospace;
	}
</style>
