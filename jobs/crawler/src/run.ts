import { collect_subjects, for_subject } from "./crawler";
import { setTimeout } from "timers/promises";
import schedule from "node-schedule";

async function run(): Promise<void> {
	let class_codes: string[] = await collect_subjects();
	process.setMaxListeners(Infinity);
	const MAX_CONCURRENT: number = 10;
	let current_running: number = 0;

	const executeForSubject = async (classCode: string): Promise<String> => {
		try {
			const res = await for_subject(classCode);
			return res;
		} finally {
			current_running--;
		}
	};

	while (class_codes.length > 0 || current_running > 0) {
		while (current_running < MAX_CONCURRENT && class_codes.length > 0) {
			const classCode = class_codes.pop()!;
			executeForSubject(classCode);
			current_running++;
		}

		await setTimeout(100);
	}

	// const sortedCourseOfferCount: { [subject: string]: number } = Object.fromEntries(
	// 	Object.entries(course_offer_count).sort(([, countA], [, countB]) => countB - countA)
	// );
	// console.log(sortedCourseOfferCount);
}
run().catch((err) => console.error(err));

if (require.main === module) {
	if (process.argv.includes("-i")) {
		run();
		process.exit(1);
	}

	schedule.scheduleJob("0 0 * * 0", run);
	setInterval(schedule.scheduleJob.bind(schedule), 60000);
}
