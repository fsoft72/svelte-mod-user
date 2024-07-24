<script lang="ts">
	import Button from '$liwe3/components/Button.svelte';
	import Checkbox from '$liwe3/components/Checkbox.svelte';
	import { type UserAuth } from '$liwe3/types/user_auth';
	import { has_perm, isTrue, keys } from '$liwe3/utils/utils';
	import { system_admin_permissions_list } from '$modules/system/actions';
	import { onMount } from 'svelte';

	interface SystemPerms {
		[key: string]: Record<string, string>;
	}

	interface PermsSelectorProps {
		perms: string[];

		// events
		onupdate: (perms: string[]) => void;
	}

	let { perms = [], onupdate }: PermsSelectorProps = $props();

	let permissions: SystemPerms = $state({});
	let form: HTMLFormElement | null = $state(null);

	const setPerms = () => {
		const formData = new FormData(form!);
		const values = Object.fromEntries(formData.entries());
		const newPerms: string[] = [];

		for (const [k, v] of Object.entries(values)) {
			const [module, name] = k.split('.');

			if (isTrue(v)) newPerms.push(`${module}.${name}`);
		}

		onupdate(newPerms);
	};

	onMount(async () => {
		const res = await system_admin_permissions_list();

		if (res.error) {
			console.error('Error getting permissions: ', res.error);
			return;
		}

		permissions = res;
	});
</script>

{#if keys(permissions || {}).length === 0}
	<div>No permissions found</div>
{:else}
	<form bind:this={form}>
		<table class="permission-block">
			<tbody>
				{#each Object.keys(permissions || {}) as mod}
					<tr>
						<th colspan="3" class="title">{mod}</th>
					</tr>
					{#each Object.keys(permissions[mod]).sort() as perm_name}
						<tr>
							<td class="check"
								><Checkbox
									name={perm_name}
									checked={has_perm({ perms } as UserAuth, perm_name)}
									value="on"
								/></td
							>
							<td class="perm-name">{perm_name}</td>
							<td class="perm-descr">{permissions[mod][perm_name]}</td>
						</tr>
					{/each}
				{/each}
			</tbody>
		</table>
	</form>
	<div class="footer">
		<Button mode="success" onclick={setPerms}>Update User</Button>
	</div>
{/if}

<style>
	.permission-block {
		background-color: var(--liwe3-main-bg-color);
		padding: 10px;
		margin: 0.5rem 0;
	}

	.title {
		font-size: 120%;
		font-weight: bold;
		text-align: left;
		padding: 0.5rem 0;
	}

	.check {
		padding-left: 1rem;
	}

	.perm-name {
		font-weight: bold;
		padding-right: 1rem;
		vertical-align: center;
	}

	.perm-descr {
		white-space: nowrap;
		vertical-align: center;
	}

	.footer {
		border-top: 1px solid var(--liwe3-lighter-secondary-color);
		padding-top: 1rem;
		text-align: right;
	}
</style>
