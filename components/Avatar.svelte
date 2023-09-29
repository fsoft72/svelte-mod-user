<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$liwe3/components/Button.svelte';
	import type { UserAuth } from '$liwe3/types/user_auth';
	import { user_logout } from '$modules/user/actions';
	import { clearUser } from '../store';

	export let user: UserAuth | null = null;
	export let logoutURL: string = '/';

	let showDropdown = false;

	function toggleDropdown() {
		showDropdown = !showDropdown;
		console.log('toggleDropdown: ', showDropdown);
	}
</script>

<div class="avatar">
	{#if user}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="avatar-container" on:click={toggleDropdown} on:keyup={toggleDropdown}>
			{#if user}
				{#if user.avatar}
					<img src={user.avatar} alt={user.name} />
				{:else}
					<span>{user.name?.charAt(0)}</span>
				{/if}
			{/if}
		</div>
		{#if showDropdown}
			<div class="avatar-dropdown">
				<ul>
					<li><a href="/user/profile">Profile</a></li>
					<li>
						<!-- svelte-ignore a11y-missing-attribute -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<a
							on:click={() => {
								showDropdown = false;
								user_logout();
								clearUser();
								goto(logoutURL);
							}}
							>Logout
						</a>
					</li>
				</ul>
			</div>
		{/if}
	{:else}
		<Button size="sm" on:click={() => goto('/auth/login')}>Login</Button>
	{/if}
</div>

<style>
	.avatar {
		display: flex;
		position: relative;

		width: 40px;
		height: 40px;

		align-items: center;

		margin-right: 28px;
	}

	.avatar-container {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		overflow: hidden;
		cursor: pointer;

		background-color: yellow;
		color: black;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.avatar img {
		width: 100%;
	}

	.avatar-dropdown {
		position: absolute;
		top: 100%;
		right: 0;
		z-index: 1;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		padding: 8px;
	}

	.avatar-dropdown ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.avatar-dropdown li {
		margin: 0;
		padding: 0;
	}

	.avatar-dropdown a {
		display: block;
		padding: 8px;
		text-decoration: none;
		color: #333;
	}

	.avatar-dropdown a:hover {
		background-color: #f5f5f5;
	}
</style>
