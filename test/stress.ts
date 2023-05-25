import axios from "axios";
import { ProgressBar, move_cursor } from "@csun_catalog_and_schedules/progress_bar";

const baseUrl = "http://localhost:2222";

const stressTest = async (): Promise<void> => {
	const requests: Promise<void>[] = [];

	const concurrentRequests = 300;
	const totalRequests = 10000;
	const total_bar = new ProgressBar(totalRequests, 1, "Total:   |");
	const success_bar = new ProgressBar(totalRequests, 2, "Success: |");
	const failure_bar = new ProgressBar(totalRequests, 3, "Failed:  |");
	let done: number = 0;
	let _200: number = 0;
	let _500: number = 0;

	// Endpoint paths to test
	const endpoints = [
		"/:subject-:catalog_number/catalog",
		"/:subject/levels/:level",
		"/:subject-:catalog_number/:semester-:year/schedule",
		"/profs/:subject/:id"
	];

	// Generate random parameters for each request
	const generateRandomParams = () => {
		const randomSubject = "COMP";
		const randomCatalogNumber = (Math.floor(Math.random() * 500) + 100).toString();
		const randomLevel = Math.floor(Math.random() * 6).toString();
		const randomSemester = "fall";
		const randomYear = "2023";
		const randomId = Math.floor(Math.random() * 50).toString();

		return {
			subject: randomSubject,
			catalog_number: randomCatalogNumber,
			level: randomLevel,
			semester: randomSemester,
			year: randomYear,
			id: randomId
		};
	};

	// Send a single request to a random endpoint
	const sendRequest = async () => {
		const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
		const randomParams: {
			subject: string;
			catalog_number: string;
			level: string;
			semester: string;
			year: string;
			id: string;
		} = generateRandomParams();
		
    const url = `${baseUrl}${randomEndpoint.replace(
			/:(\w+)/g,
			(_, key) => randomParams[key as keyof typeof randomParams]
		)}`;

		try {
			await axios.get(url);
			success_bar.update(_200++);
		} catch (error) {
			failure_bar.update(_500++);
		} finally {
			total_bar.update(done++);
    }

	};

	// Create an array of concurrent requests
	for (let i = 0; i < concurrentRequests; i++) {
		requests.push(
			...Array.from({ length: Math.floor(totalRequests / concurrentRequests) }, () =>
				sendRequest()
			)
		);
	}

	// Wait for all requests to complete
	await Promise.all(requests);
	move_cursor(4);
	console.log(_200);
	console.log(_500);
};

// Run the stress test
stressTest();
