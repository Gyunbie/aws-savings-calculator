import Papa from 'papaparse';

import { SAVINGS_DATA_URL } from '$lib/constants/links';
import type { PageServerLoad } from './$types';
import type { SavingData } from '$lib/types/aws';

type PapaParseData = {
	data: SavingData[];
	errors: Papa.ParseError[];
};

export const load: PageServerLoad = async ({ cookies }) => {
	async function getSavingsData(): Promise<SavingData[]> {
		const res = await fetch(SAVINGS_DATA_URL);

		if (res.ok) {
			const text = await res.text();

			const { data, errors }: PapaParseData = Papa.parse(text, {
				header: true,
				skipEmptyLines: true,
				dynamicTyping: true
			});

			if (errors.length) {
				throw new Error('Unable to parse savings data');
			}

			return data;
		} else {
			throw new Error('Unable to fetch savings data');
		}
	}

	return {
		savingsData: await getSavingsData()
	};
};
