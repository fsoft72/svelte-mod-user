<script lang="ts">
	import Button from '$liwe3/components/Button.svelte';
	import DataGrid, { type GridAction } from '$liwe3/components/DataGrid.svelte';
	import Modal from '$liwe3/components/Modal.svelte';
	import FormCreator from '$liwe3/components/FormCreator.svelte';
	import {
		user_admin_add,
		user_admin_change_password,
		user_admin_del,
		user_admin_fields,
		user_admin_list,
		user_admin_relogin,
		user_perms_set
	} from '$modules/user/actions';
	import { addToast } from '$liwe3/stores/ToastStore';
	import PermsSelector from '$modules/user/components/PermsSelector.svelte';

	import gridFields from './subs/user.fields';
	import Paginator from '$liwe3/components/Paginator.svelte';
	import { onMount } from 'svelte';
	import { has_perm } from '$liwe3/utils/utils';
	import { initUser, user } from '$modules/user/store';
	import { _ } from '$liwe3/stores/LocalizationStore';
	import UserAdminCreate from './UserAdminCreate.svelte';
	import { goto } from '$app/navigation';
	import { PencilSquare, Trash, ShieldCheck, FingerPrint, Identification } from 'svelte-hero-icons';

	export let maxRowsPerPage = 15;
	export let customActions: GridAction[] = [];

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

	const actions: GridAction[] = [...customActions];

	if (has_perm($user, 'user.create')) {
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
				action: (row: any) => {
					currentRow = row;
					editModalOpen = true;
					console.log('Edit', row);
				}
			});
		}
	}

	if (has_perm($user, 'user.perms')) {
		if (!actions.find((a) => a.id == 'perms')) {
			actions.push({
				id: 'perms',
				label: 'Permissions',
				icon: ShieldCheck,
				mode: 'mode2',
				action: (row: any) => {
					currentRow = row;
					permsModalOpen = true;
				}
			});
		}
	}

	if (has_perm($user, 'user.password')) {
		if (!actions.find((a) => a.id == 'pwd')) {
			actions.push({
				id: 'pwd',
				label: 'Password',
				icon: FingerPrint,
				mode: 'mode3',
				action: (row: any) => {
					currentRow = row;
					passwordModalOpen = true;
				}
			});
		}
	}

	if (has_perm($user, 'user.change_identity')) {
		// console.log('has_perm', $user, 'user.change_identity');

		if (!actions.find((a) => a.id == 'change_identity')) {
			actions.push({
				id: 'change_identity',
				label: 'Change identity',
				icon: Identification,
				mode: 'mode4',
				action: (row: any) => {
					changeIdentity(row.id);
				}
			});
		}
	}

	if (has_perm($user, 'user.create')) {
		if (!actions.find((a) => a.id == 'delete')) {
			actions.push({
				id: 'delete',
				label: 'Delete',
				icon: Trash,
				mode: 'error',
				action: (row: any) => {
					currentRow = row;
					deleteModalOpen = true;
				}
			});
		}
	}

	const changeIdentity = async (id: string) => {
		const res = await user_admin_relogin(id);

		if (res.error) return;

		initUser({
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

	const onEditSubmit = async (data: any) => {
		let res: any = null;
		let msg = $_('User created successfully');

		if (data.id) {
			res = await user_admin_fields(data.id, data);
			msg = $_('User updated successfully');
		} else {
			res = await user_admin_add(
				data.email,
				'Th3P455word!',
				data.username,
				data.name,
				data.lastname,
				undefined,
				data.enabled,
				undefined,
				data.group
			);
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

	const refreshUsers = async () => {
		const res = await user_admin_list();

		if (res.error) return;

		users = res;
		totRows = users?.length ?? 0;
	};

	onMount(async () => {
		await refreshUsers();
	});
</script>

<div class="container">
	<div class="buttons">
		<p class="title">{$_('Users List')}</p>
		{#if has_perm($user, 'user.create')}
			<Button
				mode="mode2"
				size="sm"
				href="/user/create"
				on:click={() => {
					currentRow = { id: '' };
					editModalOpen = true;
				}}
			>
				{$_('Create user')}
			</Button>
		{/if}
	</div>
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
			<Button mode="error" on:click={deleteUser}>Delete User</Button>
			<Button mode="info" on:click={() => (deleteModalOpen = false)}>Cancel</Button>
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
		<UserAdminCreate user={currentRow} on:user={(e) => onEditSubmit(e.detail)} />
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
	.container {
		background-color: var(--liwe3-dark-600);
		border-radius: var(--liwe-border-radius);
	}
	.delete-user {
		font-weight: bold;
		text-align: center;
		padding: 10px;
	}

	.buttons {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.3rem 1rem;

		gap: 1rem;
	}
</style>
