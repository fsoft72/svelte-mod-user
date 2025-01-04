<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$liwe3/components/Button.svelte';
	import ThemeSwatchColors from '$modules/theme/components/ThemeSwatchColors.svelte';
	import { user_logout } from '$modules/user/actions';
	import { storeUser, userStoreClear } from '../store.svelte';

	interface AvatarProps {
		logoutURL?: string;
	}

	let { logoutURL = '/' }: AvatarProps = $props();

	let showDropdown = $state(false);
	let colorSwatch = $state(false);

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}
</script>

<div class="avatar">
	{#if storeUser?.uid}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="avatar-container" onclick={toggleDropdown} onkeyup={toggleDropdown}>
			{#if storeUser.avatar}
				<img src={storeUser.avatar} alt={storeUser.name} />
			{:else}
				<span>{storeUser.name?.charAt(0)}</span>
			{/if}
		</div>
		{#if showDropdown}
			<div class="avatar-dropdown">
				<ul>
					<li><a href="/user/profile">Profile</a></li>
					<li><a href="/user/theme">Theme</a></li>
					<li>
						<!-- svelte-ignore a11y_invalid_attribute -->
						<a href="#" onclick={() => (colorSwatch = !colorSwatch)}>Color Swatch</a>
					</li>
					<li>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<!-- svelte-ignore a11y_missing_attribute -->
						<a
							onclick={() => {
								showDropdown = false;
								user_logout();
								userStoreClear();
								goto(logoutURL);
							}}
							>Logout
						</a>
					</li>
				</ul>
			</div>
		{/if}
	{:else}
		<Button size="sm" onclick={() => goto('/auth/login')}>Login</Button>
	{/if}
</div>

{#if colorSwatch}
	<ThemeSwatchColors />
{/if}

<style>
	.avatar {
		display: flex;
		position: relative;

		width: 40px;
		height: 40px;

		align-items: center;

		margin-right: 28px;

		user-select: none;
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

		z-index: 100000;
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
