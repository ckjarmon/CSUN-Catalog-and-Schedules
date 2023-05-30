import { Pool, PoolClient } from "pg";

const pool = new Pool({
	user: "kyeou",
	password: "q1w2e3r4!@#$",
	host: "127.0.0.1",
	port: 5432,
	database: "csun",
	max: 5
});

const get_connection = async (): Promise<PoolClient> => {
	try {
		const client = await pool.connect();
		return client;
	} catch (err) {
		console.error(`Error connecting to PostgreSQL: ${err}`);
		throw err;
	}
};


const level_query: string = 
`SELECT subject, catalog_number, title 
FROM catalog 
WHERE subject = $1 
AND catalog_number LIKE $2 || '%'`;

const catalog_query: string = 
`SELECT * 
FROM catalog 
WHERE subject = $1 
AND catalog_number = $2`;

const professor_schedule_query = 
`SELECT * 
FROM section 
WHERE instructor 
ILIKE '%' || $1 || '%' 
AND instructor ILIKE '%' || $2 || '%' 
AND subject = $3 
AND semester = 'fall' 
AND year = '2023'`;

const professor_details_query = 
`SELECT * 
FROM professor 
WHERE first_name = $1 
AND last_name = $2`;

const professor_first_last_name_query = 
`SELECT first_name, last_name 
FROM professor 
WHERE subject = $1`;

const schedule_query: string = 
`SELECT * 
FROM section 
WHERE subject = $1 
AND catalog_number = $2 
AND semester = $3 
AND year = $4`;


export { get_connection };


export {
	level_query,
	catalog_query,
	schedule_query,
	professor_schedule_query,
	professor_details_query,
	professor_first_last_name_query
};
