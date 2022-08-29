import type { ChatEvent, ClientToServerEvents } from 'backFrontCommon';
import { state } from './state';

export function isPositiveInteger(s: string) {
	return s.length > 0 && Number.isInteger(+s) && +s >= 0;
}
