"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const pg_1 = require("pg");
const argparse_1 = tslib_1.__importDefault(require("argparse"));
const app = (0, express_1.default)();
const parser = new argparse_1.default.ArgumentParser();
parser.add_argument('--project_location', {
    nargs: '?',
    type: String,
    help: 'Path to config file'
});
const args = parser.parse_args();
if (args.project_location) {
    process.chdir(args.project_location);
}
const name_normalize = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
const pool = new pg_1.Pool({
    user: 'user',
    password: 'q1w2e3r4!@#$',
    host: '127.0.0.1',
    port: 5432,
    database: 'csun',
    max: 5,
});
const get_conn = async () => {
    try {
        const client = await pool.connect();
        return client;
    }
    catch (err) {
        console.error(`Error connecting to PostgreSQL: ${err}`);
        throw err;
    }
};
app.get('/:subject-:catalog_number/catalog', async (req, res) => {
    console.log(req.originalUrl);
    const { subject, catalog_number } = req.params;
    const rootCursor = await get_conn();
    try {
        const query = `SELECT 
                        subject, 
                        catalog_number, 
                        title, 
                        description, 
                        units, 
                        prerequisites, 
                        corequisites
                        FROM catalog 
                        WHERE subject = '${subject.toUpperCase()}' 
                        AND catalog_number = '${catalog_number}'`;
        const x = await rootCursor.query(query);
        res.json(x.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
    finally {
        rootCursor.release();
    }
});
app.get('/:subject/levels/:level', async (req, res) => {
    try {
        const rootCursor = await get_conn();
        const subject = req.params.subject.toUpperCase();
        const level = req.params.level[0];
        const query = `SELECT
                        subject,
                        catalog_number,
                        title
                        FROM catalog
                        WHERE subject = '${subject}'
                        AND catalog_number LIKE '${level}%';`;
        const fetch = await rootCursor.query(query);
        const results = fetch.rows[0].map((x) => `${x.subject} ${x.catalog_number} - ${x.title}`);
        res.send(results);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/:subject-:catalog_number/:semester-:year/schedule', async (req, res) => {
    console.log(req.originalUrl);
    const { subject, catalog_number, semester, year } = req.params;
    const rootCursor = await get_conn();
    try {
        const query = `SELECT 
                        class_number, 
                        enrollment_cap, 
                        enrollment_count, 
                        instructor, 
                        days, 
                        location,
                        start_time, 
                        end_time, 
                        catalog_number, 
                        subject 
                        FROM section 
                        WHERE subject = '${subject.toUpperCase()}' 
                        AND catalog_number = '${catalog_number}' 
                        AND semester = '${semester}' 
                        AND year = ${year}`;
        const le_fetch = await rootCursor.query(query);
        res.json(le_fetch.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
    finally {
        rootCursor.release();
    }
});
app.get('/profs/:subject/:id?', async (req, res) => {
    console.log(req.originalUrl);
    const rootCursor = await get_conn();
    const subject = req.params.subject.toUpperCase();
    if (req.params.id) {
        const query = `SELECT first_name, last_name FROM professor WHERE subject = '${subject}'`;
        const rows = (await rootCursor.query(query)).rows;
        const profs_as_first_last = rows.map((x) => `${x.first_name} ${x.last_name}`);
        const sorted_profs_as_first_last = profs_as_first_last.sort((a, b) => name_normalize(a.split(' ')[1]) < name_normalize(b.split(' ')[1]) ? -1 : 1);
        const id = Number(req.params.id) - 1;
        const prof_query = `SELECT 
                            email, 
                            first_name, 
                            last_name, 
                            image_link, 
                            phone_number, 
                            location, 
                            website, 
                            mail_drop, 
                            subject, 
                            office 
                            FROM professor 
                            WHERE first_name = '${sorted_profs_as_first_last[id].split(' ')[0]}' 
                            AND last_name = '${sorted_profs_as_first_last[id].split(' ')[1]}'`;
        const query_result = await rootCursor.query(prof_query);
        const prof_rows = query_result.rows;
        const p = {
            email: prof_rows[0].email,
            first_name: name_normalize(prof_rows[0].first_name),
            last_name: name_normalize(prof_rows[0].last_name),
            image_link: prof_rows[0].image_link || 'N/A',
            phone_number: prof_rows[0].phone_number || 'N/A',
            location: prof_rows[0].location || 'N/A',
            website: prof_rows[0].website || 'N/A',
            mail_drop: prof_rows[0].mail_drop || 'N/A',
            subject: prof_rows[0].subject || 'N/A',
            office: prof_rows[0].office || 'N/A'
        };
        const section_query = `SELECT 
                                class_number, 
                                enrollment_cap, 
                                enrollment_count, 
                                instructor, 
                                days, 
                                location, 
                                start_time, 
                                end_time, 
                                catalog_number, 
                                subject 
                                FROM section 
                                WHERE instructor LIKE '%${p.last_name.split(',')[0]}%' 
                                AND subject = '${subject.toLowerCase()}' 
                                AND semester = 'fall' AND year = '2023'`;
        const query_result_2 = await rootCursor.query(section_query);
        const section_rows = query_result_2.rows[0];
        const sch = section_rows.map((c) => ({
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
            sch
        };
        res.send(result);
    }
    else {
        const subject = req.params.subject.toUpperCase();
        const query = `SELECT first_name, last_name FROM professor WHERE subject = '${subject}'`;
        const rows = await rootCursor.query(query);
        const profs = rows.rows[0].map((row) => `${name_normalize(row.first_name)} ${name_normalize(row.last_name)}`)
            .sort((a, b) => a.split(' ')[1].localeCompare(b.split(' ')[1]));
        const response = profs.map((prof, index) => `${index + 1} ${prof}\n`).join('');
        res.send(response);
    }
});
app.listen(2222, () => {
    console.log("Running...");
});
