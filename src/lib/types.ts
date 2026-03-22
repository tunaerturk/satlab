export type RWAnswerOption = {
	id: string;
	content: string;
};

export type RWSATQuestion = {
	vaultid: string;
	keys: string[];
	rationale: string;
	origin: string;
	stem: string;
	externalid: string;
	stimulus: string;
	templateclusterid: string;
	parenttemplatename: string;
	parenttemplateid: string;
	type: string;
	position: string;
	templateclustername: string;
	answerOptions: RWAnswerOption[];
	correct_answer: string[];
};

export type RWSATQuestionsItem = {
	updateDate: number;
	pPcc: string;
	questionId: string;
	skill_cd: string;
	score_band_range_cd: number;
	skill_desc: string;
	createDate: number;
	program: string;
	primary_class_cd_desc: string;
	ibn: string | null;
	external_id: string;
	primary_class_cd: string;
	uId: string;
	difficulty: string;
};

export type RWSATQuestions = RWSATQuestionsItem[];

export type navIcons = {
	satLAB: string;
	home: string;
	bank: string;
	summary: string;
	donate: string;
	settings: string;
};

export type Theme = 'light' | 'dark';
