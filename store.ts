import { browser } from '$app/environment';
import type { UserAuth } from '$liwe3/types/user_auth';
import { writable } from 'svelte/store';

// create a writable store for the LiWEUser
export const userStore = writable<UserAuth | null>( null );

// set data to the user store
export const setUser = ( data: UserAuth | null ) => {
	userStore.set( data );

	// save the user data to the localStorage
	if ( data && browser ) {
		// convert data to Base64
		localStorage.setItem( 'user', JSON.stringify( data ) );

		// set a cookie with the data
		const base64 = btoa( JSON.stringify( data ) );
		document.cookie = `user=${ base64 }; path=/`;
	}
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const initUser = ( data: Record<string, any> ) => {
	setUser( {
		uid: data.uid,
		name: data.name,
		username: data.username,
		email: data.email,
		avatar: data.avatar,
		perms: data.perms,
		token: data.token,
	} );
};

export const clearUser = () => {
	userStore.set( null );

	// clear the localStorage
	localStorage.removeItem( 'user' );

	// delete the cookie
	document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export let currentUser: UserAuth | null = null;

// subscribe to the user store
userStore.subscribe( ( value ) => {
	currentUser = value;
} );