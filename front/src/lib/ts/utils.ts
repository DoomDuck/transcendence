import type { ClientToServerEvents } from 'backFrontCommon';

export function isPositiveInteger(s: string) {
	return s.length > 0 && Number.isInteger(+s) && +s >= 0;
}
