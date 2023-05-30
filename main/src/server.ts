import express, { Request, Response } from "express";
import { Pool, PoolClient } from "pg";
import logger from "@csun_catalog_and_schedules/logger";
import {
	catalog_query,
	level_query,
	schedule_query,
	professor_schedule_query,
	professor_details_query,
	professor_first_last_name_query
} from "./queries";
const app = express();

interface Professor {
	email: string;
	first_name: string;
	last_name: string;
	image_link: string;
	phone_number: string;
	location: string;
	website: string;
	mail_drop: string;
	subject: string;
	office: string;
}

interface Schedule {
	class_number: number;
	enrollment_cap: number;
	enrollment_count: number;
	instructor: string;
	days: string;
	location: string;
	start_time: string;
	end_time: string;
	catalog_number: string;
	subject: string;
}

const name_normalize = (str: string): string => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

const pool = new Pool({
	user: "kyeou",
	password: "q1w2e3r4!@#$",
	host: "127.0.0.1",
	port: 5432,
	database: "csun",
	max: 5
});

const get_conn = async (): Promise<PoolClient> => {
	try {
		const client = await pool.connect();
		return client;
	} catch (err) {
		console.error(`Error connecting to PostgreSQL: ${err}`);
		throw err;
	}
};

app.get("/:subject-:catalog_number/catalog", async (req: Request, res: Response) => {
	const { subject, catalog_number } = req.params;
	const rootCursor = await get_conn();
	try {
		const le_fetch = (await rootCursor.query(catalog_query, [subject.toUpperCase(), catalog_number]))
			.rows[0];

		logger.http(`Endpoint: ${req.originalUrl}\n\tHTTP: 200`);
		res.json(le_fetch);
	} catch (err) {
		logger.error(`Endpoint: ${req.originalUrl}\n\tHTTP: 500`);
		res.status(500).send("Internal Server Error");
	} finally {
		rootCursor.release();
	}
});

app.get("/:subject/levels/:level", async (req: Request, res: Response) => {
	const rootCursor = await get_conn();
	try {
		const subject: string = req.params.subject.toUpperCase();
		const level: string = req.params.level[0];

		const le_fetch = (await rootCursor.query(level_query, [subject, level])).rows;

		const results = le_fetch.map(
			(x: { subject: string; catalog_number: string; title: string }) =>
				`${x.subject} ${x.catalog_number} - ${x.title}`
		);
		logger.http(`Endpoint: ${req.originalUrl}\n\tHTTP: 200`);
		res.send(results);
	} catch (err) {
		logger.error(`Endpoint: ${req.originalUrl}\n\tHTTP: 500`);
		res.status(500).send("Internal Server Error");
	} finally {
		rootCursor.release();
	}
});

app.get("/:subject-:catalog_number/:semester-:year/schedule", async (req: Request, res: Response) => {
	const { subject, catalog_number, semester, year } = req.params;
	const rootCursor = await get_conn();
	try {
		const le_fetch = (
			await rootCursor.query(schedule_query, [
				subject.toUpperCase(),
				catalog_number,
				semester,
				year
			])
		).rows;
		logger.http(`Endpoint: ${req.originalUrl}\n\tHTTP: 200`);
		res.json(le_fetch);
	} catch (err) {
		logger.error(`Endpoint: ${req.originalUrl}\n\tHTTP: 500`);
		res.status(500).send("Internal Server Error");
	} finally {
		rootCursor.release();
	}
});

app.get("/profs/:subject/:id?", async (req: Request, res: Response) => {
	const get_professors_by_subject = async (_SUBJECT: string, _ROOTCURSOR: PoolClient) => {
		const rows: { first_name: string; last_name: string }[] = (
			await rootCursor.query(professor_first_last_name_query, [_SUBJECT])
		).rows;
		return rows.map((x) => `${x.first_name} ${x.last_name}`);
	};

	const get_professor_details = async (
		_OPTIONS: { _FIRSTNAME: string; _LASTNAME: string },
		_ROOTCURSOR: PoolClient
	) => {
		const { _FIRSTNAME, _LASTNAME } = _OPTIONS;
		return await _ROOTCURSOR.query(professor_details_query, [_FIRSTNAME, _LASTNAME]);
	};

	const get_professor_schedule = async (
		_OPTIONS: { _FIRSTNAME: string; _LASTNAME: string; _SUBJECT: string },
		_ROOTCURSOR: PoolClient
	) => {
		const { _FIRSTNAME, _LASTNAME, _SUBJECT } = _OPTIONS;

		return await _ROOTCURSOR.query(professor_schedule_query, [
			_FIRSTNAME.split(",")[0],
			_LASTNAME.split(",")[0],
			_SUBJECT.toUpperCase()
		]);
	};

	const rootCursor = await get_conn();
	const subject = req.params.subject.toUpperCase();

	try {
		if (req.params.id) {
			const professors = await get_professors_by_subject(subject, rootCursor);
			const sortedProfessors = professors.sort((a, b) =>
				name_normalize(a.split(" ")[1]) < name_normalize(b.split(" ")[1]) ? -1 : 1
			);
			const id: number = Number(req.params.id) - 1;
			const [firstName, lastName] = sortedProfessors[id].split(" ");

			const { rows } = await get_professor_details(
				{ _FIRSTNAME: firstName, _LASTNAME: lastName },
				rootCursor
			);
			const profRows = rows[0];
			const p: Professor = {
				email: profRows.email,
				first_name: name_normalize(profRows.first_name),
				last_name: name_normalize(profRows.last_name),
				image_link: profRows.image_link || "N/A",
				phone_number: profRows.phone_number || "N/A",
				location: profRows.location || "N/A",
				website: profRows.website || "N/A",
				mail_drop: profRows.mail_drop || "N/A",
				subject: profRows.subject || "N/A",
				office: profRows.office || "N/A"
			};

			const { rows: sectionRows } = await get_professor_schedule(
				{ _FIRSTNAME: firstName, _LASTNAME: lastName, _SUBJECT: subject },
				rootCursor
			);
			const schedule = sectionRows.map((c: Schedule) => ({
				class_number: c.class_number,
				enrollment_cap: c.enrollment_cap,
				enrollment_count: c.enrollment_count,
				instructor: c.instructor,
				days: c.days,
				location: c.location,
				start_time: c.start_time,
				end_time: c.end_time,
				catalog_number: c.catalog_number,
				subject: c.subject
			}));

			const result = {
				info: p,
				schedule: schedule.sort((a, b) => a.catalog_number.localeCompare(b.catalog_number))
			};
			res.json(result);
		} else {
			const professors = await get_professors_by_subject(subject, rootCursor);
			const response = professors.map((prof, index) => `${index + 1} ${prof}\n`).join("");
			res.send(response);
		}

		logger.http(`Endpoint: ${req.originalUrl}\n\tHTTP: 200`);
	} catch (err) {
		logger.error(`Endpoint: ${req.originalUrl}\n\tHTTP: 500`);
		res.status(500).send("Internal Server Error");
	} finally {
		rootCursor.release();
	}
});

app.listen(2222, () => {
	logger.info(`Running on http://localhost:2222`);
});
