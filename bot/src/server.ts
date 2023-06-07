import express, { Request, Response } from "express";
import logger from "@csun_catalog_and_schedules/logger";
import {
	catalog_query,
	level_query,
	schedule_query,
	professor_schedule_query,
	professor_details_query,
	professor_first_last_name_query
} from "./database";
import { get_connection } from "./database";
import { Professor, Schedule } from "./interfaces";
import { PoolClient } from "pg";
const app = express();

const name_normalize = (str: string): string => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

app.get("/:subject-:catalog_number/catalog", async (req: Request, res: Response) => {
	const { subject, catalog_number } = req.params;
	const root_cursor = await get_connection();
	try {
		const le_fetch = (
			await root_cursor.query(catalog_query, [subject.toUpperCase(), catalog_number])
		).rows[0];

		logger.http(`Endpoint: ${req.originalUrl}\n\tHTTP: 200`);
		res.json(le_fetch);
	} catch (err) {
		logger.error(`Endpoint: ${req.originalUrl}\n\tHTTP: 500`);
		res.status(500).send("Internal Server Error");
	} finally {
		root_cursor.release();
	}
});

app.get("/:subject/levels/:level", async (req: Request, res: Response) => {
	const root_cursor = await get_connection();
	try {
		const subject: string = req.params.subject.toUpperCase();
		const level: string = req.params.level[0];

		const le_fetch = (await root_cursor.query(level_query, [subject, level])).rows;

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
		root_cursor.release();
	}
});

app.get("/:subject-:catalog_number/:semester-:year/schedule", async (req: Request, res: Response) => {
	const { subject, catalog_number, semester, year } = req.params;
	const root_cursor = await get_connection();
	try {
		const le_fetch = (
			await root_cursor.query(schedule_query, [
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
		root_cursor.release();
	}
});

app.get("/profs/:subject/:id?", async (req: Request, res: Response) => {
	const get_professors_by_subject = async (_SUBJECT: string, _ROOTCURSOR: PoolClient) => {
		const rows: { first_name: string; last_name: string }[] = (
			await root_cursor.query(professor_first_last_name_query, [_SUBJECT])
		).rows;
		return rows
			.map((x) => `${name_normalize(x.first_name)} ${name_normalize(x.last_name)}`)
			.sort((a, b) => a.split(" ")[1].localeCompare(b.split(" ")[1]));
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
			_FIRSTNAME,
			_LASTNAME,
			_SUBJECT.toUpperCase()
		]);
	};

	const root_cursor = await get_connection();
	const subject = req.params.subject.toUpperCase();

	try {
		if (req.params.id) {
			const professors = await get_professors_by_subject(subject, root_cursor);
			const sortedProfessors = professors.sort((a, b) =>
				name_normalize(a.split(" ")[1]) < name_normalize(b.split(" ")[1]) ? -1 : 1
			);

			const id: number = Number(req.params.id) - 1;
			const [firstName, lastName] = sortedProfessors[id].split(" ");

			const { rows } = await get_professor_details(
				{ _FIRSTNAME: firstName, _LASTNAME: lastName },
				root_cursor
			);

			const professor_row = rows[0];
			const p: Professor = {
				email: professor_row.email,
				first_name: name_normalize(professor_row.first_name),
				last_name: name_normalize(professor_row.last_name),
				image_link: professor_row.image_link || "N/A",
				phone_number: professor_row.phone_number || "N/A",
				location: professor_row.location || "N/A",
				website: professor_row.website || "N/A",
				mail_drop: professor_row.mail_drop || "N/A",
				subject: professor_row.subject || "N/A",
				office: professor_row.office || "N/A"
			};

			const { rows: section_rows } = await get_professor_schedule(
				{ _FIRSTNAME: firstName, _LASTNAME: lastName, _SUBJECT: subject },
				root_cursor
			);

			const schedule = section_rows.map((c: Schedule) => ({
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
			const professors = await get_professors_by_subject(subject, root_cursor);
			const response = professors.map((prof, index) => `${index + 1} ${prof}\n`).join("");
			res.send(response);
		}

		logger.http(`Endpoint: ${req.originalUrl}\n\tHTTP: 200`);
	} catch (err) {
		logger.error(`Endpoint: ${req.originalUrl}\n\tHTTP: 500`);
		res.status(500).send("Internal Server Error");
	} finally {
		root_cursor.release();
	}
});

app.listen(2222, () => {
	logger.info(`Running on http://localhost:2222`);
});
