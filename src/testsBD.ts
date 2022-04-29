interface ITest {
	id: string;
	nameTest: string;
	qw: {
			question: string;
			answer: string[];
			correct: string
		}[];
}

export const tests: ITest[] = [];