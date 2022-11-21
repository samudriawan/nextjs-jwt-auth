import { createContext, useContext } from 'react';

export const authContext = createContext({});

export function useAuthContext() {
	return useContext(authContext);
}
