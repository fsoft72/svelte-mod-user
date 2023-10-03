<script lang="ts">
	import Button from '$liwe3/components/Button.svelte';
	import DataGrid, { type GridAction } from '$liwe3/components/DataGrid.svelte';
	import Modal from '$liwe3/components/Modal.svelte';
	import FormCreator from '$liwe3/components/FormCreator.svelte';
	import {
		user_admin_change_password,
		user_admin_del,
		user_admin_fields,
		user_admin_list,
		user_perms_set
	} from '$modules/user/actions';
	import type { FormField } from '$liwe3/components/FormCreator.svelte';
	import { addToast } from '$liwe3/stores/ToastStore';
	import PermsSelector from '$modules/user/components/PermsSelector.svelte';

	import gridFields from './subs/user.fields';
	import Paginator from '$liwe3/components/Paginator.svelte';
	import { onMount } from 'svelte';
	import { has_perm } from '$liwe3/utils/utils';
	import { user } from '$modules/user/store';
	import { _ } from '$liwe3/stores/LocalizationStore';

	export let maxRowsPerPage = 15;

	let users: any[] = [];
	let filteredUsers: any[] = [];
	let displayUsers: any[] = [];

	let deleteModalOpen = false;
	let editModalOpen = false;
	let permsModalOpen = false;
	let passwordModalOpen = false;
	let currentRow: any = null;

	let filters: Record<string, any> = {};
	let totRows: number = 0;

	const userEditFields: FormField[] = [
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

	const actions: GridAction[] = [];

	if (has_perm($user, 'user.create')) {
		gridFields.map((field) => {
			field.editable = true;
		});

		gridFields.push({
			name: 'enabled',
			label: 'Enabled',
			type: 'checkbox',
			editable: true,
			sortable: false,
			filterable: false
		});

		actions.push({
			id: 'edit',
			label: 'Edit',
			icon: 'edit',
			action: (row: any) => {
				currentRow = row;
				editModalOpen = true;
				console.log('Edit', row);
			}
		});
	}

	if (has_perm($user, 'user.perms'))
		actions.push({
			id: 'perms',
			label: 'Permissions',
			icon: 'permissions',
			action: (row: any) => {
				currentRow = row;
				permsModalOpen = true;
			}
		});

	if (has_perm($user, 'user.password'))
		actions.push({
			id: 'pwd',
			label: 'Password',
			icon: 'password',
			action: (row: any) => {
				currentRow = row;
				passwordModalOpen = true;
			}
		});

	if (has_perm($user, 'user.create'))
		actions.push({
			id: 'delete',
			label: 'Delete',
			icon: 'delete',
			action: (row: any) => {
				currentRow = row;
				deleteModalOpen = true;
			}
		});

	const deleteUser = async () => {
		deleteModalOpen = false;

		const res = await user_admin_del(currentRow.id);

		if (res.error) return;

		users = users.filter((r) => r.id !== currentRow.id);

		addToast({
			type: 'success',
			message: $_('User deleted successfully')
		});
	};

	const onEditSubmit = async (data: any) => {
		const res = await user_admin_fields(data.id, data);

		if (res.error) return;

		addToast({
			type: 'success',
			message: 'User updated successfully'
		});
	};

	const onPermsUpdated = async (data: any) => {
		// const res = await user_admin_fields(currentRow.id, data);
		const res = await user_perms_set(currentRow.id, data);

		if (res.error) return;

		addToast({
			type: 'success',
			message: 'Permissions updated successfully'
		});
	};

	const onFilterChange = (e: CustomEvent) => {
		filters = e.detail;
		console.log('onFilterChange', filters);

		const u: any[] = [];

		users.forEach((user) => {
			let add = true;

			for (const field in filters) {
				const filter = filters[field];
				if (filter.mode == '==') {
					if (filter) {
						if (!user[field] || user[field].indexOf(filter.value) == -1) {
							add = false;
						}
					}
				}
			}

			if (add) u.push(user);
		});

		filteredUsers = u;
		totRows = u.length;
	};

	$: {
		filteredUsers = users || [];
		displayUsers = users?.slice(0, maxRowsPerPage) ?? [];
	}

	$: {
		displayUsers = filteredUsers.slice(0, maxRowsPerPage);
	}

	onMount(async () => {
		const res = await user_admin_list();

		if (res.error) return;

		users = res;
		totRows = users?.length ?? 0;
	});
</script>

<div class="content">
	<DataGrid
		data={displayUsers}
		fields={gridFields}
		{actions}
		updateField={async (row, field_name) => {
			console.log('updateField', row, field_name);
			const res = await user_admin_fields(row.id, { [field_name]: row[field_name] });

			if (res.error) return;
		}}
		on:filterchange={onFilterChange}
	/>
	<Paginator
		total={totRows}
		rows={maxRowsPerPage}
		on:pagechange={(e) => {
			displayUsers = filteredUsers.slice(
				(e.detail.page - 1) * maxRowsPerPage,
				e.detail.page * maxRowsPerPage
			);
		}}
	/>
</div>

{#if deleteModalOpen}
	<Modal
		title="Delete user"
		on:confirm={() => {
			users = users.filter((r) => r.id !== currentRow.id);
			deleteModalOpen = false;
		}}
		on:cancel={() => {
			deleteModalOpen = false;
		}}
	>
		Please confirm you want to delete user<br />
		<div class="delete-user">{currentRow?.email}</div>

		<div slot="footer">
			<Button mode="danger" on:click={deleteUser}>Delete User</Button>
			<Button mode="success" on:click={() => (deleteModalOpen = false)}>Cancel</Button>
		</div>
	</Modal>
{/if}

{#if editModalOpen}
	<Modal
		title="Edit user"
		on:confirm={() => {
			editModalOpen = false;
		}}
		on:cancel={() => {
			editModalOpen = false;
		}}
	>
		<FormCreator
			fields={userEditFields}
			values={currentRow}
			on:submit={(e) => onEditSubmit(e.detail)}
		/>
	</Modal>
{/if}

{#if permsModalOpen}
	<Modal
		title="User Permissions"
		on:confirm={() => {
			permsModalOpen = false;
		}}
		on:cancel={() => {
			permsModalOpen = false;
		}}
	>
		<PermsSelector perms={currentRow?.perms || {}} on:update={(e) => onPermsUpdated(e.detail)} />
	</Modal>
{/if}

{#if passwordModalOpen}
	<Modal
		title={$_('Change password')}
		on:confirm={() => {
			passwordModalOpen = false;
		}}
		on:cancel={() => {
			passwordModalOpen = false;
		}}
	>
		<FormCreator
			fields={[
				{
					name: 'password',
					label: $_('Password'),
					type: 'password',
					required: true,
					placeholder: $_('Password'),
					size: 'md'
				},
				{
					name: 'password_confirm',
					label: $_('Confirm password'),
					type: 'password',
					required: true,
					placeholder: $_('Confirm password'),
					size: 'md'
				}
			]}
			on:submit={async (e) => {
				const { password, password_confirm } = e.detail;

				if (password != password_confirm) {
					addToast({
						type: 'error',
						message: $_('Passwords do not match')
					});

					return;
				}

				const res = await user_admin_change_password(currentRow.id, password);

				if (res.error) return;

				addToast({
					type: 'success',
					message: $_('Password changed successfully')
				});

				passwordModalOpen = false;
			}}
		/>
	</Modal>
{/if}

<style>
	.content {
		margin-bottom: 30em;
	}
	.delete-user {
		font-weight: bold;
		text-align: center;
		padding: 10px;
	}
</style>
