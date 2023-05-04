const request = require('supertest');
const app = require('./server.js');;



// Mock database connection function
jest.mock('mariadb', () => ({
    createPool: jest.fn(() => ({
        getConnection: jest.fn().mockResolvedValue('fakeConnection'),
    })),
}));


describe('Test the server routes', () => {
    // Test /:subject-:catalog_number/catalog route
    test('It should response the GET method with correct response for /:subject-:catalog_number/catalog', async () => {
        const response = await request(app).get('/COMP-482/catalog');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ "subject": { "subject": "COMP", "catalog_number": "482", "title": "Algorithm Design and Analysis", "description": "Prerequisites: COMP 282; COMP 256/L or MATH 320 or MATH 326. The analysis of algorithms, in terms of time and space complexity for best/average/worst case execution using asymptotic notation; the application of standard algorithmic approaches, including greedy, divide and conquer, and dynamic programming, to algorithm design; and a review of classical algorithms, including sorting, searching, and graph algorithms.", "units": "3", "prerequisites": "{{COMP 282} && {{COMP 256/L} || {MATH 320} || {MATH 326}}}", "corequisites": "{None}" } });
    });

    // Test /:subject-:catalog_number/:semester-:year/schedule route
    test('It should response the GET method with correct response for /:subject-:catalog_number/:semester-:year/schedule', async () => {
        const response = await request(app).get('/COMP-482/spring-2023/schedule');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([
            [{ "class_number": 16856, "enrollment_cap": 28, "enrollment_count": 36, "instructor": "adam.clark@csun.edu", "days": "TR", "location": "ONLINE", "start_time": "1600h", "end_time": "1715h", "catalog_number": "482", "subject": "COMP" }, { "class_number": 16857, "enrollment_cap": 28, "enrollment_count": 30, "instructor": "john.noga@csun.edu", "days": "TR", "location": "JD3510", "start_time": "1530h", "end_time": "1645h", "catalog_number": "482", "subject": "COMP" }, { "class_number": 16939, "enrollment_cap": 28, "enrollment_count": 27, "instructor": "john.noga@csun.edu", "days": "S", "location": "JD3508", "start_time": "1100h", "end_time": "1345h", "catalog_number": "482", "subject": "COMP" }]
        ]);
    });

    // Test /time route
    test('It should response the GET method with current time in the correct format for /time', async () => {
        const response = await request(app).get('/time');
        expect(response.statusCode).toBe(200);
        const currentTimeRegex = new RegExp(/^ - As of (Sun|Mon|Tue|Wed|Thu|Fri|Sat) \d{1,2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:\d{2}$/);
        expect(response.text).toMatch(currentTimeRegex);
    });


    test('responds with a list of professors when :id is not provided', async () => {
        const response = await request(app).get('/profs/comp');
        expect(response.status).toBe(200);
        expect(response.text).toMatch(new RegExp(/^\d+ [A-Z][a-z]+( [A-Z][a-z]+)*$/));
    });

    test('responds with a professor and their schedule when :id is provided', async () => {
        const response = await request(app).get('/profs/comp/43');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ "info": { "email": "john.noga@csun.edu", "first_name": "John", "last_name": "Noga", "image_link": "https://api.metalab.csun.edu/media/1.1/faculty/media/john.noga/avatar?source=true", "phone_number": "8186776480", "location": "JD 4429", "website": "http://www.csun.edu/~jnoga", "mail_drop": "91330-8281", "subject": "COMP", "office": "N/A" }, "sch": [{ "class_number": 16691, "enrollment_cap": 28, "enrollment_count": 0, "instructor": "Noga,John J", "days": "TR", "location": "JD3508", "start_time": "0900h", "end_time": "1015h", "catalog_number": "310", "subject": "COMP" }, { "class_number": 16760, "enrollment_cap": 28, "enrollment_count": 0, "instructor": "Noga,John J", "days": "TR", "location": "JD2221", "start_time": "1600h", "end_time": "1715h", "catalog_number": "615", "subject": "COMP" }, { "class_number": 17118, "enrollment_cap": 28, "enrollment_count": 0, "instructor": "Noga,John J", "days": "TR", "location": "JD3508", "start_time": "1030h", "end_time": "1145h", "catalog_number": "482", "subject": "COMP" }, { "class_number": 17271, "enrollment_cap": 27, "enrollment_count": 0, "instructor": "Noga,John J", "days": "F", "location": "JD3504", "start_time": "0900h", "end_time": "1145h", "catalog_number": "610", "subject": "COMP" }] });
    });
});