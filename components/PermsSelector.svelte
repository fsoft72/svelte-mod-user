<script lang="ts">
	import Button from '$liwe3/components/Button.svelte';
	import Input from '$liwe3/components/Input.svelte';
	import { system_admin_permissions_list } from '$modules/system/actions';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	interface SystemPerms {
		[key: string]: Record<string, string>;
	}

	export let perms: Record<string, string[]> = {};
	let permissions: SystemPerms = {};
	let form: HTMLFormElement;

	const _has_perm = (perm_name: string): boolean => {
		const [module, name] = perm_name.split('.');

		if (!perms[module]) return false;

		const v = perms[module].includes(name);

		console.log('=== has_perm: ', module, ' name: ', name, ' v: ', v, ' perms: ', perms[module]);

		if (!v) return false;

		return true;
	};

	const setPerms = () => {
		const formData = new FormData(form);
		const values = Object.fromEntries(formData.entries());
		const newPerms: Record<string, string[]> = {};

		for (const [k, v] of Object.entries(values)) {
			const [module, name] = k.split('.');
			if (!newPerms[module]) newPerms[module] = [];

			console.log('=== k: ', k, ' v: ', v, ' module: ', module, ' name: ', name);

			if (v == 'true') newPerms[module].push(name);
		}

		dispatch('update', newPerms);
	};

	onMount(async () => {
		const res = await system_admin_permissions_list();

		permissions = res.permissions;
	});
</script>

{#if Object.keys(permissions || {}).length === 0}
	<div>No permissions found</div>
{:else}
	<form bind:this={form}>
		<table class="permission-block">
			{#each Object.keys(permissions || {}) as mod}
				<tr>
					<th colspan="3" class="title">{mod}</th>
				</tr>
				{#each Object.keys(permissions[mod]).sort() as perm_name}
					<tr>
						<td class="check"
							><Input
								type="checkbox"
								name={perm_name}
								checked={_has_perm(perm_name)}
								value="on"
							/></td
						>
						<td class="perm-name">{perm_name}</td>
						<td class="perm-descr">{permissions[mod][perm_name]}</td>
					</tr>
				{/each}
			{/each}
		</table>
	</form>
	<div class="footer">
		<Button mode="success" on:click={setPerms}>Update User</Button>
	</div>
{/if}

<style>
	.permission-block {
		background-color: var(--liwe-main-bg-color);
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
		border-top: 1px solid var(--liwe-lighter-secondary-color);
		padding-top: 1rem;
		text-align: right;
	}
</style>
