import type { SavingData } from '$lib/types/aws';

export function parseSavingData(array: SavingData[], attribute: string) {
	return [...new Set(array.map((item) => String(item[attribute as keyof typeof item])))].sort();
}
