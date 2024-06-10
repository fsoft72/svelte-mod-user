import { browser } from '$app/environment';
import type { UserAuth } from '$liwe3/types/user_auth';
import { clearObject } from '$liwe3/utils/utils';

// create a writable store for the LiWEUser
export const storeUser: UserAuth = $state(
	{
		uid: '',
		name: '',
		username: '',
		email: '',
		avatar: '',
		perms: [],
		token: '',
	}
);

// set data to the user store
export const userStoreUpdate = ( data: UserAuth | null ) => {
	Object.assign( storeUser, data );

	// save the user data to the localStorage
	if ( data && browser ) {
		// convert data to Base64
		localStorage.setItem( 'user', JSON.stringify( storeUser ) );

		// set a cookie with the data
		const base64 = btoa( JSON.stringify( storeUser ) );
		document.cookie = `user=${ base64 }; path=/`;
	}
};

export const userStoreClear = () => {
	clearObject( storeUser );

	// clear the localStorage
	localStorage.removeItem( 'user' );

	// delete the cookie
	document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};