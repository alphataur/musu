import { writable } from 'svelte/store';

export const searchResults = writable([]);
export const searchParam = writable("rock")