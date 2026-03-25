import type { RWSATQuestions } from './types';

const domain = 'INI,CAS,EOI,SEC';

export const getQuestions = async (domain: string, test: number): Promise<RWSATQuestions> => {
	const res = await fetch(
		'https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-questions',
		{
			method: 'POST',
			body: JSON.stringify({
				asmtEventId: 99,
				test,
				domain
			})
		}
	);

	return (await res.json()) as RWSATQuestions;
};
