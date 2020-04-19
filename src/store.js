import { writable, get } from 'svelte/store';

// store File object to communicate between drop and /viewdroppedfile
export const fileToShow = writable(null);

