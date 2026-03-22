import type { RWSATQuestion } from './types.ts';

const ex: string = 'c4d80f10-e0f8-4466-bc5a-e45343eceed5';
export const getQuestion = async (external_id: string): Promise<RWSATQuestion> => {
	const res = await fetch(
		'https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-question',
		{
			method: 'POST',
			body: JSON.stringify({ external_id })
		}
	);

	return (await res.json()) as RWSATQuestion;
};
