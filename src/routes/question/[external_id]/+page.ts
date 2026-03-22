import { getQuestion } from '$lib/getQuestion';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const question = await getQuestion(params.external_id);

	return {
		question
	};
};
