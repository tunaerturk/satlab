import { browser } from '$app/environment';
import type { navIcons, Theme } from '$lib/types';
import { get, writable } from 'svelte/store';

export let icons = writable({
	satLAB: '',
	home: '',
	bank: '',
	summary: '',
	donate: '',
	settings: ''
});

export let activePage = writable('');
export let screenWidth = writable(0);

export let themeStore = {
	current: writable(
		browser
			? (localStorage.getItem('theme') as Theme) ||
					(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
			: 'light'
	),

	applyTheme: () => {
		if (browser) {
			document.documentElement.classList.toggle('dark', get(themeStore.current) === 'dark');
			localStorage.setItem('theme', get(themeStore.current));
		}
	}
};
