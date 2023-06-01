import { collect_subjects, for_subject } from "./crawler";
import { setTimeout } from "timers/promises";
import schedule from "node-schedule";
import { ArgumentParser } from "argparse";

const parser = new ArgumentParser({
	prog: "Scheduled Crawler"
});

parser.add_argument("--semester_key", {
	type: "str",
	default: "2237" // Fall 2023
});

parser.add_argument("-i", {
	action: "store_true"
});

parser.add_argument("--headless", {
	type: "str" || "bool",
	default: "new"
	
});

parser.add_argument("--cc", {
	type: "int",
	default: 5
});


let args = parser.parse_args();

async function run(): Promise<void> {
	let class_codes: string[] = await collect_subjects(args.semester_key);
	process.setMaxListeners(Infinity);
	const MAX_CONCURRENT: number = args.cc;
	let current_running: number = 0;

	const executeForSubject = async (classCode: string): Promise<void> => {
		await for_subject(classCode, args.semester_key, args.headless).then(() => {
				current_running--;
			});
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


if (args.i) {
	run()
		.then(() => {
			process.exit(1);
		})
		.catch((err) => console.error(err));
}

schedule.scheduleJob("0 0 * * *", run);

