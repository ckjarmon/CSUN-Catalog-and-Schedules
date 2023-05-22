const argparse = require('argparse');
const webdriver = require('selenium-webdriver');
const { By, Key } = webdriver;
const chrome = require('selenium-webdriver/chrome');
const mariadb = require('mariadb');
const schedule = require('node-schedule');



const parser = new argparse.ArgumentParser({
    prog: 'Scheduled Crawler',
});

parser.add_argument('--semester', {
    type: 'str',
});

parser.add_argument('--year', {
    type: 'int',
});

parser.add_argument('--semester_key', {
    type: 'str',
});

parser.add_argument('-i', {
    action: 'store_true',
});

const args = parser.parse_args();

const class_codes = [
    'AE',
    'AM',
    'AR',
    'AAS',
    'ACCT',
    'AFRS',
    'AIS',
    'ANTH',
    'ARAB',
    'ARMN',
    'ART',
    'ASTR',
    'AT',
    'ATHL',
    'BANA',
    'BIOL',
    'BLAW',
    'BUS',
    'CE',
    'CADV',
    'CAS',
    'CCE',
    'CD',
    'CECS',
    'CHS',
    'CHEM',
    'CHIN',
    'CIT',
    'CJS',
    'CLAS',
    'CM',
    'COMP',
    'COMS',
    'CTVA',
    'DEAF',
    'EED',
    'ECE',
    'ECON',
    'EDUC',
    'ELPS',
    'ENGL',
    'ENT',
    'EOH',
    'EPC',
    'FCBE',
    'FCCA',
    'FCHC',
    'FCS',
    'FIN',
    'FLIT',
    'FREN',
    'GBUS',
    'GEH',
    'GEOG',
    'GEOL',
    'GWS',
    'HEBR',
    'HHD',
    'HIST',
    'HSCI',
    'HUM',
    'INDS',
    'IS',
    'ITAL',
    'JS',
    'JAPN',
    'JOUR',
    'KIN',
    'KNFC',
    'KOR',
    'LIB',
    'LING',
    'LRS',
    'ME',
    'MATH',
    'MCOM',
    'MGT',
    'MKT',
    'MSE',
    'MUS',
    'NURS',
    'PERS',
    'PHIL',
    'PHSC',
    'PHYS',
    'POLS',
    'PSY',
    'PT',
    'QS',
    'RS',
    'RE',
    'RTM',
    'RUSS',
    'SED',
    'SCI',
    'SCM',
    'SOC',
    'SOM',
    'SPAN',
    'SPED',
    'SUS',
    'SUST',
    'SWRK',
    'TH',
    'UNIV',
    'URBS',
];

const results_api = {};
const results_web = {};

const catalog_link =
    'https://cmsweb.csun.edu/psc/CNRPRD/EMPLOYEE/SA/c/NR_SSS_COMMON_MENU.NR_SSS_SOC_BASIC_C.GBL?PortalActualURL=https%3a%2f%2fcmsweb.csun.edu%2fpsc%2fCNRPRD%2fEMPLOYEE%2fSA%2fc%2fNR_SSS_COMMON_MENU.NR_SSS_SOC_BASIC_C.GBL&PortalContentURL=https%3a%2f%2fcmsweb.csun.edu%2fpsc%2fCNRPRD%2fEMPLOYEE%2fSA%2fc%2fNR_SSS_COMMON_MENU.NR_SSS_SOC_BASIC_C.GBL&PortalContentProvider=SA&PortalCRefLabel=Class%20Search&PortalRegistryName=EMPLOYEE&PortalServletURI=https%3a%2f%2fmynorthridge.csun.edu%2fpsp%2fPANRPRD%2f&PortalURI=https%3a%2f%2fmynorthridge.csun.edu%2fpsc%2fPANRPRD%2f&PortalHostNode=EMPL&NoCrumbs=yes&PortalKeyStruct=yes';

function convert_time(time) {
    if (time === 'TBA') {
        return ['0000h', '0000h'];
    }
    let start_hour = parseInt(time.substring(0, 2));
    let start_is_am = time.substring(5, 7) === 'am' || time.substring(0, 2) === '12';
    let end_hour = parseInt(time.substring(8, 10));
    let end_is_am = time.substring(13, 15) === 'am' || time.substring(8, 10) === '12';

    if (!start_is_am) {
        start_hour += 12;
    }
    if (!end_is_am) {
        end_hour += 12;
    }

    const start_string = start_hour < 10 ? '0' + start_hour : String(start_hour);
    const end_string = end_hour < 10 ? '0' + end_hour : String(end_hour);

    return [start_string + time.substring(3, 5) + 'h', end_string + time.substring(11, 13) + 'h'];
}

function convertdays(days_str) {
    const day_map = { Mo: 'M', Tu: 'T', We: 'W', Th: 'R', Fr: 'F', Sa: 'S' };

    for (const day in day_map) {
        days_str = days_str.replace(day, day_map[day]);
    }

    return days_str;
}

function gather(arrow) {
    const service = new chrome.ServiceBuilder().build();
    const options = new chrome.Options();
    // options.addArguments("--headless");
    // options.setExperimentalOption("excludeSwitches", ["enable-logging"]);
    const driver = new chrome.Driver(service, options);
    driver.get(catalog_link);
    driver.sleep(4000);

    driver.findElement(By.id("NR_SSS_SOC_NWRK_STRM")).click();
    driver.findElement(By.id("NR_SSS_SOC_NWRK_STRM")).sendKeys(args.semester_key, Key.RETURN);
    driver.sleep(1000);
    /*
        while (true) {
            try {
                await driver.findElement(By.id("EXPANDCNT")).click();
                break;
            } catch (error) {
                continue;
            }
        }
    
        const id_box = await driver.findElement(By.name("NR_SSS_SOC_NWRK_SUBJECT"));
        await id_box.click();
        await driver.sleep(1000);
        for (let i = 0; i <= arrow; i++) {
            await id_box.sendKeys(Key.ARROW_DOWN);
        }
        await id_box.sendKeys(Key.RETURN);
        await driver.sleep(2000);
    
        while (true) {
            try {
                await driver.findElement(By.id("NR_SSS_SOC_NWRK_BASIC_SEARCH_PB")).click();
                await driver.sleep(5000);
                break;
            } catch (error) {
                continue;
            }
        }
    
        const sub_sects = [];
    
        for (let a = 0; a < 600; a++) {
            try {
                while (true) {
                    try {
                        const section_title = await driver.findElement(By.id("NR_SSS_SOC_NWRK_DESCR100_2$" + a)).getText();
                        console.log(section_title);
                        const section_title_array = section_title.split(" ");
                        break;
                    } catch (error) {
                        continue;
                    }
                }
    
                while (true) {
                    try {
                        await driver.findElement(By.id("SOC_DETAIL$" + a)).click();
                        await driver.sleep(1000);
                        break;
                    } catch (error) {
                        continue;
                    }
                }
    
                const course_dict = {};
    
                for (let i = 0; i < 600; i++) {
                    try {
                        if (section_title_array[2].match(/^\w+$/)) {
                            course_dict["subject"] = section_title_array[0] + section_title_array[1];
                            course_dict["catalog_number"] = section_title_array[2];
                            course_dict["title"] = section_title_array[4];
                            let start_of_class_name = 5;
                            while (section_title_array[start_of_class_name] !== "(") {
                                course_dict["title"] += " " + section_title_array[start_of_class_name];
                                start_of_class_name++;
                            }
                        } else {
                            course_dict["subject"] = section_title_array[0];
                            course_dict["catalog_number"] = section_title_array[1];
                            course_dict["title"] = section_title_array[3];
                            let start_of_class_name = 4;
                            while (section_title_array[start_of_class_name] !== "(") {
                                course_dict["title"] += " " + section_title_array[start_of_class_name];
                                start_of_class_name++;
                            }
                        }
    
                        while (true) {
                            try {
                                course_dict["class_number"] = await driver.findElement(By.id("NR_SSS_SOC_NSEC_CLASS_NBR$" + i)).getText();
                                break;
                            } catch (error) {
                                console.log(`${class_codes[arrow]}  ========`);
                                continue;
                            }
                        }
    
                        while (true) {
                            try {
                                course_dict["enrollment_cap"] = parseInt(await driver.findElement(By.id("NR_SSS_SOC_NWRK_AVAILABLE_SEATS$" + i)).getText());
                                break;
                            } catch (error) {
                                console.log(`${class_codes[arrow]}  ========`);
                                continue;
                            }
                        }
    
                        course_dict["enrollment_count"] = 0;
    
                        while (true) {
                            try {
                                course_dict["days"] = convertdays(await driver.findElement(By.id("NR_SSS_SOC_NWRK_DESCR20$" + i)).getText());
                                break;
                            } catch (error) {
                                console.log(`${class_codes[arrow]}  ========`);
                                continue;
                            }
                        }
    
                        while (true) {
                            try {
                                course_dict["location"] = await driver.findElement(By.id("MAP$" + i)).getText();
                                break;
                            } catch (error) {
                                console.log(`${class_codes[arrow]}  ========`);
                                continue;
                            }
                        }
    
                        while (true) {
                            try {
                                const timeSpan = await driver.findElement(By.id("TIME$span$" + i)).getText();
                                if (timeSpan.includes("-")) {
                                    const [start_time, end_time] = convert_time(timeSpan);
                                    course_dict["start_time"] = start_time;
                                    course_dict["end_time"] = end_time;
                                } else {
                                    course_dict["start_time"] = timeSpan;
                                    course_dict["end_time"] = timeSpan;
                                }
                                break;
                            } catch (error) {
                                continue;
                            }
                        }
    
                        while (true) {
                            try {
                                course_dict["instructor"] = await driver.findElement(By.id("FACURL$" + i)).getText();
                                break;
                            } catch (error) {
                                course_dict["instructor"] = "Staff";
                                break;
                            }
                        }
    
                        sub_sects.push(course_dict);
                    } catch (error) {
                        break;
                    }
                }
    
                await driver.findElement(By.id("SOC_DETAIL1$" + a)).click();
                await driver.sleep(2500);
            } catch (error) {
                continue;
            }
        }
    
        results_web[class_codes[arrow]] = sub_sects;
        fs.writeFileSync('results_api.json', JSON.stringify(results_web));
        await driver.quit();
    
        let sub_dict = {};
        let _url = `https://api.metalab.csun.edu/curriculum/api/2.0/terms/${args.semester[0].toUpperCase()}${args.semester.slice(1).toLowerCase()}-${args.year}/classes/${class_codes[arrow]}`;
    
        while (true) {
            try {
                let response = await fetch(_url);
                let data = await response.json();
    
                for (let course of data.classes) {
                    if (course.meetings.length > 0) {
                        try {
                            if (course.instructors.length > 0) {
                                sub_dict[`${class_codes[arrow].toUpperCase()} ${course.catalog_number}`].push({
                                    class_number: course.class_number,
                                    enrollment_cap: course.enrollment_cap,
                                    enrollment_count: course.enrollment_count,
                                    waitlist_cap: course.waitlist_cap,
                                    waitlist_count: course.waitlist_count,
                                    instructor: course.instructors[0].instructor,
                                    days: course.meetings[0].days,
                                    location: course.meetings[0].location,
                                    start_time: course.meetings[0].start_time,
                                    end_time: course.meetings[0].end_time
                                });
                            } else {
                                sub_dict[`${class_codes[arrow].toUpperCase()} ${course.catalog_number}`].push({
                                    class_number: course.class_number,
                                    enrollment_cap: course.enrollment_cap,
                                    enrollment_count: course.enrollment_count,
                                    waitlist_cap: course.waitlist_cap,
                                    waitlist_count: course.waitlist_count,
                                    instructor: "Staff",
                                    days: course.meetings[0].days,
                                    location: course.meetings[0].location,
                                    start_time: course.meetings[0].start_time,
                                    end_time: course.meetings[0].end_time
                                });
                            }
                        } catch (error) {
                            if (course.instructors.length > 0) {
                                sub_dict[`${class_codes[arrow].toUpperCase()} ${course.catalog_number}`] = [{
                                    class_number: course.class_number,
                                    enrollment_cap: course.enrollment_cap,
                                    enrollment_count: course.enrollment_count,
                                    waitlist_cap: course.waitlist_cap,
                                    waitlist_count: course.waitlist_count,
                                    instructor: course.instructors[0].instructor,
                                    days: course.meetings[0].days,
                                    location: course.meetings[0].location,
                                    start_time: course.meetings[0].start_time,
                                    end_time: course.meetings[0].end_time
                                }];
                            } else {
                                sub_dict[`${class_codes[arrow].toUpperCase()} ${course.catalog_number}`] = [{
                                    class_number: course.class_number,
                                    enrollment_cap: course.enrollment_cap,
                                    enrollment_count: course.enrollment_count,
                                    waitlist_cap: course.waitlist_cap,
                                    waitlist_count: course.waitlist_count,
                                    instructor: "Staff",
                                    days: course.meetings[0].days,
                                    location: course.meetings[0].location,
                                    start_time: course.meetings[0].start_time,
                                    end_time: course.meetings[0].end_time
                                }];
                            }
                        }
                    }
                }
    
                console.log(class_codes[arrow]);
                break;
            } catch (error) {
                console.log(`${class_codes[arrow]} caused decode error`);
            }
        }
        if (class_codes[arrow] === "COMP") { console.log(sub_dict) }
        let sub_dict_section = {};
        for (let k of Object.keys(sub_dict)) {
            let sec_list = [...sub_dict[k]];
            sub_dict_section[k] = {};
    
            for (let sl of sec_list) {
                sub_dict_section[k][sl.class_number] = sl;
            }
        }
    
        results_api[class_codes[arrow]] = sub_dict_section;
        fs.writeFileSync('results_api.json', JSON.stringify(results_api));*/
}

function da_job() {
    /* const semaphore = require('semaphore')(10); // allow up to 10 threads to run at once

    function gatherWrapper(codeIndex) {
        semaphore.take(() => {
            gather(codeIndex);
            semaphore.leave();
        });
    }

    const t = [];

    for (let i = 0; i < class_codes.length; i++) {
        const code = class_codes[i];
        t.push(
            new Thread(() => {
                gatherWrapper(class_codes.indexOf(code));
            })
        );
        t[t.length - 1].start();
    }

    for (let i = 0; i < t.length; i++) {
        t[i].join();
    }
*/

    for (let i = 0; i < class_codes.length; i++) {
        gather(i)
    }
    /*
        let rootConnection, rootCursor;
    
        try {
            rootConnection = mariadb.connect({
                user: "py_serv",
                password: "q1w2e3r4!@#$",
                host: "127.0.0.1",
                port: 3306,
                database: "csun"
            });
            rootCursor = rootConnection.cursor();
        } catch (err) {
            console.log(`Error connecting to MariaDB Platform: ${err}`);
        }
    
        process.stdout.write('[');
        for (let i = 0; i < class_codes.length; i++) {
            process.stdout.write('=');
            const code = class_codes[i];
            for (let j = 0; j < results_web[code].length; j++) {
                const course = results_web[code][j];
                try {
                    rootCursor.execute(
                        `select title from csun.${code}_view where catalog_number = '${course.catalog_number}'`
                    );
                } catch (err) {
                    rootCursor.execute(
                        `create view ${code}_view as select * from catalog where subject = "${code}"`
                    );
                }
    
                try {
                    course.title = rootCursor.fetchall()[0][0];
                } catch (err) {
                    continue;
                }
            }
        }
        process.stdout.write(']\n[');
        for (let i = 0; i < class_codes.length; i++) {
            process.stdout.write('=');
            const code = class_codes[i];
            try {
                const allClasses = {};
                for (let j = 0; j < results_web[code].length; j++) {
                    const course = results_web[code][j];
                    try {
                        allClasses[`${code.toUpperCase()} ${course.catalog_number}`].push({
                            class_number: course.class_number,
                            enrollment_cap: course.enrollment_cap,
                            enrollment_count: course.enrollment_count,
                            instructor: course.instructor,
                            days: course.days,
                            location: course.location,
                            start_time: course.start_time,
                            end_time: course.end_time
                        });
                    } catch (err) {
                        allClasses[`${code.toUpperCase()} ${course.catalog_number}`] = [{
                            class_number: course.class_number,
                            enrollment_cap: course.enrollment_cap,
                            enrollment_count: course.enrollment_count,
                            instructor: course.instructor,
                            days: course.days,
                            location: course.location,
                            start_time: course.start_time,
                            end_time: course.end_time
                        }];
                    }
                    const tup = [
                        course.class_number,
                        course.enrollment_cap,
                        course.enrollment_count,
                        course.instructor,
                        course.days,
                        course.location,
                        course.start_time,
                        course.end_time,
                        args.semester.toLowerCase(),
                        args.year,
                        code,
                        course.catalog_number
                    ];
                    try {
                        rootCursor.execute(
                            `insert into section(class_number, enrollment_cap, enrollment_count, instructor, days, location, start_time, end_time, semester, year, subject, catalog_number) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            tup
                        );
                    } catch (err) {
                        continue;
                    }
                }
                const subDictSection = {};
                for (const k of Object.keys(allClasses)) {
                    const secList = allClasses[k].slice();
                    subDictSection[k] = {};
                    for (const sl of secList) {
                        subDictSection[k][sl.class_number] = sl;
                    }
                }
                results_web[code] = subDictSection;
            } catch (err) {
                continue;
            }
        }
        process.stdout.write(']\n[');
        for (let i = 0; i < class_codes.length; i++) {
            process.stdout.write('=');
            const code = class_codes[i];
            const s = results_web[code];
            try {
                for (const c of Object.keys(results_web[code])) {
                    for (const course of Object.keys(s[c])) {
                        try {
                            rootCursor.execute(
                                `update section set enrollment_cap = '${s[c][course].enrollment_cap}', instructor = ?, days = '${s[c][course].days}', start_time = '${s[c][course].start_time}', end_time = '${s[c][course].end_time}', location = '${s[c][course].location}' where class_number = '${s[c][course].class_number}' and subject = '${code}' and catalog_number = '${c.split(' ')[1]}' and semester = '${args.semester.toLowerCase()}' and year = ${args.year}`,
                                [s[c][course].instructor]
                            );
                        } catch (err) {
                            console.log(s[c][course]);
                            console.log(c);
                            process.exit();
                        }
                    }
                }
            } catch (err) {
                continue;
            }
        }
        process.stdout.write(']\n[');
        for (let i = 0; i < class_codes.length; i++) {
            process.stdout.write('=');
            const code = class_codes[i];
            const s = results_api[code];
            try {
                for (const c of Object.keys(s)) {
                    for (const course of Object.keys(s[c])) {
                        try {
                            rootCursor.execute(
                                `update section set enrollment_cap = '${s[c][course].enrollment_cap}', enrollment_count = '${s[c][course].enrollment_count}', instructor = ?, waitlist_cap = ${s[c][course].waitlist_cap}, waitlist_count = ${s[c][course].waitlist_count} where class_number = '${s[c][course].class_number}' and subject = '${code}' and catalog_number = '${c.split(' ')[1]}' and semester = '${args.semester.toLowerCase()}' and year = ${args.year}`,
                                [s[c][course].instructor]
                            );
                        } catch (err) {
                            console.log(s[c][course]);
                            console.log(c);
                            process.exit();
                        }
                    }
                }
            } catch (err) {
                continue;
            }
        }
        process.stdout.write(']');
    
        rootConnection.commit();
        rootCursor.close();
        rootConnection.close();
        */
}



da_job();


/*
schedule.scheduleJob('0 0 * * 0', da_job);

setInterval(() => {
    schedule.scheduleJob('0 0 * * 0', da_job);
}, 60000); */