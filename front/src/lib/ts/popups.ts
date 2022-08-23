import { writable, type Writable } from 'svelte/store';

export enum PopupCategory {
	WARNING = 'alert-warning',
	ERROR = 'alert-danger'
}

export interface CanBePopup {
	text: string;
	popupCategory: PopupCategory;
	hasButton: boolean;
	buttonLabel?: string;
	onAccept?: () => void;
	onClose?: () => void;
}

export const popups: Writable<CanBePopup[]> = writable([]);

function addPopup(popup: CanBePopup) {
	popups.update((_) => {
		_.push(popup);
		return _;
	});
}

function removePopup(popup: CanBePopup) {
	popups.update((_) => _.filter((popup2) => popup !== popup2));
}

export const popupMethods = {
	addPopup,
	removePopup
};
