import { Client } from "pg";
import { DatabaseScheduleBody } from "./interfaces";

export async function updateDB(
	course: DatabaseScheduleBody,
	term: { semester: string; year: number },
	class_code: string
): Promise<void> {
	const tup = [
		course["class_number"],
		course["enrollment_cap"],
		course["enrollment_count"],
		course["waitlist_cap"],
		course["waitlist_count"],
		course["instructor"],
		course["days"],
		course["location"],
		course["start_time"],
		course["end_time"],
		term.semester.toLowerCase(),
		term.year,
		class_code,
		course["catalog_number"]
	];
	// console.log(tup)
	try {
		const client = new Client({
			user: "user",
			host: "localhost",
			database: "csun",
			password: "q1w2e3r4!@#$",
			port: 5432
		});
		await client.connect();
		await client.query(
			`INSERT INTO section (class_number, enrollment_cap, enrollment_count, waitlist_cap, waitlist_count, instructor, days, location, start_time, end_time, semester, year, subject, catalog_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (class_number, semester, year, subject, catalog_number)
      DO UPDATE SET enrollment_cap = excluded.enrollment_cap,
                    enrollment_count = excluded.enrollment_count,
                    instructor = excluded.instructor,
                    days = excluded.days,
                    location = excluded.location,
                    start_time = excluded.start_time,
                    end_time = excluded.end_time`,
			tup
		);
		await client.end();
	} catch (error) {
		console.error("Error:", error);
	}
}
