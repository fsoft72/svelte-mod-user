<script lang="ts">
	import Button from '$liwe3/components/Button.svelte';
	import Modal from '$liwe3/components/Modal.svelte';
	import FormCreator from '$liwe3/components/FormCreator.svelte';
	import {
		user_admin_add,
		user_admin_change_password,
		user_admin_del,
		user_admin_fields,
		user_admin_list,
		user_admin_relogin,
		user_domain_set,
		user_perms_set
	} from '$modules/user/actions';
	import { addToast } from '$liwe3/stores/ToastStore.svelte';
	import PermsSelector from '$modules/user/components/PermsSelector.svelte';

	import gridFields from './subs/user.fields';
	import Paginator from '$liwe3/components/Paginator.svelte';
	import { onMount } from 'svelte';
	import { has_perm } from '$liwe3/utils/utils';
	import { storeUser, userStoreUpdate } from '$modules/user/store.svelte';
	import { _ } from '$liwe3/stores/LocalizationStore';
	import UserAdminCreate from './UserAdminCreate.svelte';
	import { goto } from '$app/navigation';
	import { PencilSquare, Trash, ShieldCheck, FingerPrint, Identification } from 'svelte-hero-icons';
	import { filterModes } from '$liwe3/utils/match_filter';
	import type {
		DataGridAction,
		DataGridButton,
		DataGridRow
	} from '$liwe3/components/DataGrid.svelte';
	import DataGrid from '$liwe3/components/DataGrid.svelte';

	interface Props {
		maxRowsPerPage?: number;
		customActions?: DataGridAction[];
	}

	let { maxRowsPerPage = 15, customActions = [] }: Props = $props();

	let users: any[] = $state([]);
	let filteredUsers: any[] = $state([]);
	const actions: DataGridAction[] = [...customActions];
	let page: number = $state(1);

	let deleteModalOpen = $state(false);
	let editModalOpen = $state(false);
	let permsModalOpen = $state(false);
	let passwordModalOpen = $state(false);
	let currentRow: any = $state(null);

	let filters: Record<string, any> = $state({});
	let totRows: number = $state(0);

	let displayUsers: any[] = $derived(
		filteredUsers.slice((page - 1) * maxRowsPerPage, page * maxRowsPerPage)
	);

	const buttons: DataGridButton[] = [];

	if (has_perm(storeUser, 'user.create')) {
		gridFields.map((field) => {
			field.editable = true;
		});

		// if enabled is not present, add it
		if (!gridFields.find((f) => f.name == 'enabled')) {
			gridFields.push({
				name: 'enabled',
				label: 'Enabled',
				type: 'checkbox',
				editable: true,
				sortable: false,
				filterable: false
			});
		}

		if (!actions.find((a) => a.id == 'edit')) {
			actions.push({
				id: 'edit',
				label: 'Edit',
				icon: PencilSquare,
				mode: 'mode1',
				onclick: (row: any) => {
					currentRow = row;
					editModalOpen = true;
					console.log('Edit', row);
				}
			});
		}

		buttons.push({
			label: $_('Create user'),
			mode: 'success',
			onclick: () => {
				currentRow = { id: '' };
				editModalOpen = true;
			}
		});
	}

	if (has_perm(storeUser, 'user.perms')) {
		if (!actions.find((a) => a.id == 'perms')) {
			actions.push({
				id: 'perms',
				label: 'Permissions',
				icon: ShieldCheck,
				mode: 'mode2',
				onclick: (row: any) => {
					currentRow = row;
					permsModalOpen = true;
				}
			});
		}
	}

	if (has_perm(storeUser, 'user.password')) {
		if (!actions.find((a) => a.id == 'pwd')) {
			actions.push({
				id: 'pwd',
				label: 'Password',
				icon: FingerPrint,
				mode: 'mode3',
				onclick: (row: any) => {
					currentRow = row;
					passwordModalOpen = true;
				}
			});
		}
	}

	if (has_perm(storeUser, 'user.change_identity')) {
		// console.log('has_perm', $user, 'user.change_identity');

		if (!actions.find((a) => a.id == 'change_identity')) {
			actions.push({
				id: 'change_identity',
				label: 'Change identity',
				icon: Identification,
				mode: 'mode4',
				onclick: (row: any) => {
					changeIdentity(row.id);
				}
			});
		}
	}

	if (has_perm(storeUser, 'user.create')) {
		if (!actions.find((a) => a.id == 'delete')) {
			actions.push({
				id: 'delete',
				label: 'Delete',
				icon: Trash,
				mode: 'error',
				onclick: (row: any) => {
					currentRow = row;
					deleteModalOpen = true;
				}
			});
		}
	}

	const changeIdentity = async (id: string) => {
		const res = await user_admin_relogin(id);

		if (res.error) return;

		userStoreUpdate({
			uid: res.id || res.id_user,
			name: `${res.name} ${res.lastname}`,
			perms: res.perms,
			email: res.email,
			token: res.access_token,
			username: res.username
		});

		addToast({
			type: 'success',
			message: $_('Identity changed successfully')
		});

		goto('/');
	};

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

	const onEditSubmit = async (data: Record<string, any>) => {
		console.log('=== SUBMIT: ', data);
		let res: any = null;
		let msg = $_('User created successfully');

		if (data.id) {
			res = await user_admin_fields(data.id, data);
			msg = $_('User updated successfully');
		} else {
			res = await user_admin_add(
				data.email,
				data.password || 'Th3P455word!',
				data.username,
				data.name || '',
				data.lastname || '',
				undefined,
				data.enabled,
				undefined,
				data.group
			);
		}

		if (res.error) {
			addToast({
				type: 'error',
				message: res.error.message
			});
			return;
		}

		if (data.domain) {
			if (has_perm(storeUser, 'system.domain')) {
				res = await user_domain_set(data.id, data.domain);
			}
		}

		if (res.error) return;

		addToast({
			type: 'success',
			message: msg
		});

		await refreshUsers();
	};

	const onPermsUpdated = async (data: any) => {
		// const res = await user_admin_fields(currentRow.id, data);
		const res = await user_perms_set(currentRow.id, data);

		currentRow.perms = data;

		if (res.error) return;

		addToast({
			type: 'success',
			message: 'Permissions updated successfully'
		});
	};

	const onfilterchange = (filters: Record<string, any>) => {
		const res: any[] = [];

		users.forEach((user) => {
			let add = true;

			for (const field in filters) {
				const filter = filters[field];

				if (filter.mode == filterModes.contains) {
					if (filter) {
						if (!user[field] || user[field].indexOf(filter.value) == -1) {
							add = false;
						}
					}
				}
			}

			if (add) res.push(user);
		});

		filteredUsers = res;
		totRows = res.length;
		page = 1;
	};

	const refreshUsers = async () => {
		const res = await user_admin_list();

		if (res.error) return;

		users = res;
		filteredUsers = [...users];
		totRows = users?.length ?? 0;
		filters = {};
	};

	$inspect('FILTERS: ', filters);

	onMount(async () => {
		await refreshUsers();
	});
</script>

<div class="container">
	{#key displayUsers}
		<DataGrid
			bind:filters
			data={displayUsers}
			fields={gridFields}
			{actions}
			{buttons}
			onupdatefield={async (row: DataGridRow, field_name: string) => {
				console.log('updateField', row, field_name);
				const res = await user_admin_fields(row.id, { [field_name]: row[field_name] });

				if (res.error) return;
			}}
			{onfilterchange}
		/>
		<Paginator
			total={totRows}
			rows={maxRowsPerPage}
			onpagechange={(page_, rows) => (page = page_)}
		/>
	{/key}
</div>

{#if deleteModalOpen}
	<Modal
		title="Delete user"
		onclose={() => {
			deleteModalOpen = false;
		}}
		oncancel={() => {
			deleteModalOpen = false;
		}}
	>
		Please confirm you want to delete user<br />
		<div class="delete-user">{currentRow?.email}</div>

		<!--
        <div slot="footer">
            <Button mode="error" on:click={deleteUser}>Delete User</Button>
            <Button mode="info" on:click={() => (deleteModalOpen = false)}>Cancel</Button>
        </div>
    -->
	</Modal>
{/if}

{#if editModalOpen}
	<Modal
		title="Edit user"
		onclose={() => {
			editModalOpen = false;
		}}
		oncancel={() => {
			editModalOpen = false;
		}}
	>
		<UserAdminCreate targetUser={currentRow} onuser={onEditSubmit} />
	</Modal>
{/if}

{#if permsModalOpen}
	<Modal
		title="User Permissions"
		onclose={() => {
			permsModalOpen = false;
		}}
		oncancel={() => {
			permsModalOpen = false;
		}}
	>
		<PermsSelector perms={currentRow?.perms || {}} onupdate={(perms) => onPermsUpdated(perms)} />
	</Modal>
{/if}

{#if passwordModalOpen}
	<Modal
		title={$_('Change password')}
		onclose={() => {
			passwordModalOpen = false;
		}}
		oncancel={() => {
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
			onsubmit={async (data: Record<string, any>) => {
				const { password, password_confirm } = data;

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
	.container {
		background-color: var(--liwe3-dark-600);
		border-radius: var(--liwe3-border-radius);
	}
	.delete-user {
		font-weight: bold;
		text-align: center;
		padding: 10px;
	}
</style>
