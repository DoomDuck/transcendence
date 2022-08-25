export function isPositiveInteger(s: string) {
	return s.length > 0 && Number.isInteger(+s) && +s >= 0;
}
