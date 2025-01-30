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
	let userPerms: Record<string, boolean> = $state({});

	const setPerms = () => {
		const newPerms: string[] = [];
		for (const [k, v] of Object.entries(userPerms)) {
			if (v) newPerms.push(k);
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

		keys<string>(permissions).map((mod) => {
			keys<string>(permissions[mod]).map((perm_name) => {
				if (has_perm({ perms } as UserAuth, perm_name)) {
					userPerms[perm_name] = true;
				} else {
					userPerms[perm_name] = false;
				}
			});
		});
	});
</script>

{#if keys(permissions || {}).length === 0}
	<div>No permissions found</div>
{:else}
	<div class="perms-container">
		<form bind:this={form}>
			<table class="permission-block">
				<tbody>
					{#each Object.keys(permissions || {}) as mod}
						<tr>
							<th colspan="3" class="title">{mod}</th>
						</tr>
						{#each Object.keys(permissions[mod]).sort() as perm_name}
							<tr>
								<td class="check">
									<Checkbox name={perm_name} bind:checked={userPerms[perm_name]} value="on" />
								</td>
								<td class="perm-name">{perm_name}</td>
								<td class="perm-descr">{permissions[mod][perm_name]}</td>
							</tr>
						{/each}
					{/each}
				</tbody>
			</table>
		</form>
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

	.perms-container {
		overflow-y: auto;
	}
</style>
