import * as path from 'path';
import axios from 'axios';
import { token } from './config.json';
import { ArgumentParser } from 'argparse';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';

const parser = new ArgumentParser();

parser.add_argument('--project_location', {
    nargs: '?',
    type: String,
    help: 'Path to config file',
});

const args = parser.parse_args();

if (args.project_location) {
    process.chdir(path.resolve(args.project_location));
}



const client = new Client({
    intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

const getCurrentDateAndTime = (): string => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'PST',
        timeZoneName: 'short',
    };

    const currentDate = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);

    return ` - As of ${formattedDate}`;
};

async function send_msg(msg: string, channel: string): Promise<void> {
    await (<TextChannel>client.channels.cache.get(channel)).send("```" + msg.substring(0, 1993) + "```");
    if (msg.substring(1994) !== "") {
        await (<TextChannel>client.channels.cache.get(channel)).send("```" + msg.substring(1994) + "```")
    };
}

async function show_prof(subject: string, itchid: string, id: string): Promise<void> {


    const baseUrl: string = "http://127.0.0.1:2222/profs/";
    const url: string = id ? `${baseUrl}${subject}/${id}` : `${baseUrl}${subject}`;
    new Promise<string>(async (resolve, reject) => {
        let ret1: string = "";
        try {

            const response = await axios.get(url);
            const { data: body } = response;

            if (!id) {
                ret1 = String(body).replace(/,/g, "");
            } else {
                body.info["Name"] = body.info.first_name + " " + body.info.last_name;

                delete body.info.subject;
                delete body.info.location;
                delete body.info.phone_number;
                delete body.info.first_name;
                delete body.info.last_name;
                delete body.info.image_link;

                for (const n in body.info) {
                    if (body.info[n] !== "N/A") {
                        ret1 += `${n.toUpperCase()}: ${body.info[n]}\n`;
                    }
                }

                ret1 += "\n\tFALL 2023\n\t-----------\n";

                ret1 += `\n${getCurrentDateAndTime()}\n`;

                ret1 += "\n\tSection\tSubject\t Class\t\t Location\t\tDays\t\t  Seats\t\t\t  Time";
                ret1 += "\n\t-------\t-------\t-------\t\t--------\t\t----\t\t  -----\t\t\t  ----\n";

                body.sch.forEach((course: {
                    class_number: number;
                    subject: string;
                    catalog_number: string;
                    location: string;
                    days: string;
                    enrollment_cap: number;
                    enrollment_count: number;
                    start_time: string;
                    end_time: string;
                }) => {
                    ret1 += ` ${course.class_number}`;

                    ret1 += course.subject.length === 4 ? `   ${course.subject}` : `   ${course.subject} `;
                    ret1 += course.catalog_number.length === 4 ? `   ${course.catalog_number}` : `   ${course.catalog_number} `;

                    if (course.location.length === 3) {
                        ret1 += "   ";
                    } else {
                        ret1 += course.location.length === 5 ? `\t\t   ${course.location}` : `\t\t  ${course.location}`;
                    }

                    if (course.days !== "None") {
                        switch (course.days.length) {
                            case 1:
                                ret1 += `    ${course.days}`;
                                break;
                            case 2:
                                ret1 += `   ${course.days}`;
                                break;
                            case 3:
                                ret1 += `   ${course.days}`;
                                break;
                            default:
                                ret1 += `  ${course.days}`;
                        }
                    } else {
                        ret1 += "  --";
                    }

                    const enrollmentCount: number = course.enrollment_cap - course.enrollment_count;
                    ret1 += `${enrollmentCount.toString().length < 10 ? `\t\t\t${enrollmentCount}\t\t\t` : `\t\t\t ${enrollmentCount}\t\t\t`}`;

                    ret1 += `${course.start_time.substring(0, 2)}:${course.start_time.substring(2, 4)}`;
                    ret1 += " - ";
                    ret1 += `${course.end_time.substring(0, 2)}:${course.end_time.substring(2, 4)}`;
                    ret1 += "\n";
                });


            }

            resolve(ret1);
        } catch (e) {
            reject(e);
        }
    }).then(async (res) => {
        await send_msg(res, itchid);
    });
}

// simply returns all classes at a specified level
async function show_levels(subject: string, level: number, itchid: string): Promise<void> {
    console.log("Show levels called.");

    new Promise<string>(async (resolve, reject) => {
        let ret1: string = "";
        try {
            const response = await axios.get(`http://127.0.0.1:2222/${subject}/levels/${level}`);
            const body = response.data;

            ret1 += `${subject.toUpperCase()} ${level.toString().padEnd(3, '0')}-level classes\n`;

            ret1 += "-".repeat(body.length);

            ret1 += ("\n");

            body.forEach((course: string) => {
                ret1 += (`${course}\n`);
            });
            resolve(ret1);
        } catch (e) {
            reject(e);
        }
    }).then(async (res) => {
        await send_msg(res, itchid);
    });
}

/* for every semester after Fall 2022 */
async function show_class(subject: string, code: string, semester: string, year: number, itchid: string): Promise<void> {
    new Promise<string>(async (resolve, reject) => {
        let ret1: string = "",
            ret2: string = "";


        console.log("Show class called.");

        try {
            const catalogResponse = await axios.get(`http://127.0.0.1:2222/${subject}-${code}/catalog`);
            const course = catalogResponse.data;

            ret1 += `${course.subject} ${course.catalog_number} ${course.title}\n\n${course.description}\n\n${course.subject} ${course.catalog_number} ${course.title} - ${semester.toUpperCase()} ${year}`;


            ret1 += getCurrentDateAndTime() + "\n";

        } catch (error) {
            console.error(error);
            reject(error)
        }

        try {
            const scheduleResponse = await axios.get(`http://127.0.0.1:2222/${subject}-${code}/${semester.toLowerCase()}-${year}/schedule`);
            const courses = scheduleResponse.data;

            ret2 += "\n\tSection\t\tLocation\t\tDays\t\t  Seats\t\t Waitlist Queue\t\t\t  Time\t\t\t\t\tFaculty";
            ret2 += "\n\t-------\t\t--------\t\t----\t\t  -----\t\t --------------\t\t\t  ----\t\t\t\t\t-------\n";

            courses.forEach((course: {
                class_number: number;
                subject: string;
                catalog_number: string;
                location: string;
                days: string;
                instructor: string;
                enrollment_cap: number;
                enrollment_count: number;
                waitlist_cap: number;
                waitlist_count: number;
                start_time: string;
                end_time: string
            }) => {
                ret2 += `\t ${course.class_number}`;

                if (course.location.length === 5) {
                    ret2 += `\t\t   ${course.location}`;
                } else if (course.location.length > 5) {
                    ret2 += `\t\t  ${course.location}`;
                } else {
                    ret2 += `\t\t     ${course.location}`;
                }

                if (course.days !== null) {
                    switch (course.days.length) {
                        case 1:
                            ret2 += `\t\t   ${course.days}`;
                            break;
                        case 2:
                        case 3:
                            ret2 += `\t\t  ${course.days}`;
                            break;
                        default:
                            ret2 += `\t\t ${course.days}`;
                            break;
                    }
                } else {
                    ret2 += ("\t\t  --");
                }

                const seats = (course.enrollment_cap - course.enrollment_count);
                ret2 += (seats.toString().length < 10) ? `\t\t\t ${seats}` : `\t\t\t  ${seats}`;

                if (course.waitlist_cap > 0) {
                    const waitlistCount = course.waitlist_count > 10 ? course.waitlist_count : ` ${course.waitlist_count}`;
                    ret2 += `\t\t\t    ${waitlistCount}\t`;
                } else {
                    ret2 += `\t\t\t    N/A   `;
                }

                ret2 += `\t\t\t${course.start_time.substring(0, 2)}:${course.start_time.substring(2, 4)} - ${course.end_time.substring(0, 2)}:${course.end_time.substring(2, 4)}`;

                ret2 += (course.instructor !== "Staff")
                    ? `\t\t${course.instructor}`
                    : `\t\t\t\tStaff`;

                ret2 += "\n";
            });
            resolve(ret1 + ret2);
        } catch (error) {
            reject(error)
        }

    }).then(async (res) => {
        await send_msg(res, itchid);
    });
}

// for every class before spring 2023
async function show_class_before_sp_23(subject: string, code: string, semester: string, year: number, itchid: string): Promise<void> {
    console.log("Show class override called.");

    new Promise<string>(async (resolve, reject) => {
        let ret1: string = "",
            ret2: string = "";

        try {
            const catalogResponse = await axios.get(`http://127.0.0.1:2222/${subject}-${code}/catalog`);
            console.log(`http://127.0.0.1:2222/${subject}-${code}/catalog`);

            const stuffs = catalogResponse.data;

            stuffs.forEach((course: {
                catalog_number: number;
                subject: string;
                title: string;
                description: string;
            }) => {
                if (course.catalog_number.toString() === code) {

                    ret1 += `${course.subject} ${course.catalog_number} ${course.title}\n\n${course.description}\n\n`;
                    ret1 += `${course.subject} ${course.catalog_number} ${course.title} - ${semester.toUpperCase()} ${year}`;


                    ret1 += getCurrentDateAndTime() + "\n";

                }
            });

            const classesResponse = await axios.get(`https://api.metalab.csun.edu/curriculum/api/2.0/terms/${semester}-${year}/classes/${subject}`);
            console.log(`https://api.metalab.csun.edu/curriculum/api/2.0/terms/${semester}-${year}/classes/${subject}`);

            const stuffs2 = classesResponse.data;

            ret2 += "\n\tSection\t\tLocation\t\tDays\t\t  Seats\t\t\t  Time\t\t\t\t\tFaculty";
            ret2 += "\n\t-------\t\t--------\t\t----\t\t  -----\t\t\t  ----\t\t\t\t\t-------\n";

            stuffs2.classes.forEach((course: {
                catalog_number: number;
                class_number: string;
                enrollment_cap: number;
                enrollment_count: number;
                meetings: {
                    location: string;
                    start_time: string;
                    end_time: string;
                    days: string
                }[],
                instructors: { instructor: string }[];
            }) => {

                if (course.catalog_number.toString() === code && course.meetings.length > 0) {

                    ret2 += `\t ${course.class_number}`;

                    ret2 += (course.meetings[0].location.length === 3)
                        ? "   "
                        : "";

                    ret2 += (course.meetings[0].location.length === 5)
                        ? `\t\t   ${course.meetings[0].location}`
                        : `\t\t  ${course.meetings[0].location}`;


                    switch (course.meetings[0].days.length) {
                        case 1:
                            ret2 += `\t\t   ${course.meetings[0].days}`;
                            break;
                        case 2:
                            ret2 += `\t\t  ${course.meetings[0].days}`;
                            break;
                        case 3:
                            ret2 += `\t\t  ${course.meetings[0].days}`;
                            break;
                        default:
                            ret2 += `\t\t ${course.meetings[0].days}`;
                    }


                    ret2 += ((`${(course.enrollment_cap - course.enrollment_count)}`).length < 10)
                        ? `\t\t\t${(course.enrollment_cap - course.enrollment_count)}\t\t\t`
                        : `\t\t\t ${(course.enrollment_cap - course.enrollment_count)}\t\t\t`;


                    ret2 += `\t\t\t${course.meetings[0].start_time.substring(0, 2)}:${course.meetings[0].start_time.substring(2, 4)}`;
                    ret2 += " - ";
                    ret2 += `${course.meetings[0].end_time.substring(0, 2)}:${course.meetings[0].end_time.substring(2, 4)}`;

                    ret2 += (course.instructors.length > 0)
                        ? `\t\t${course.instructors[0].instructor}`
                        : "\t\t\t\tStaff";
                    ret2 += ("\n");

                }
            });
            resolve(ret1 + ret2);
        } catch (e) {
            reject(e);
        }
    }).then(async (res) => {
        await send_msg(res, itchid);
    });

}


/*
client.on('messageUpdate', (oldMessage, newMessage) => {
  if (oldMessage.guild.id === guildId && newMessage.author.tag !== "CSUN Catalog & Schedules#6095") {
    client.channels.cache.get(report_channel).send(`[${newMessage.author.tag}] [${oldMessage.content}] => [${newMessage.content}]`);
  }
});

client.on('messageDelete', (message) => {
  if (message.guild.id === guildId && message.author.tag !== "CSUN Catalog & Schedules#6095") {
    client.channels.cache.get(report_channel).send(`[${message.author.tag}] [${message.content}]`);

  }
});
*/

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const {
        commandName
    } = interaction;



    switch (commandName) {
        case 'class': {

            const itchid: string = interaction.channelId;
            const semester: string = interaction.options.getString('semester') || 'fall';
            const year: number = interaction.options.getInteger('year') || 2023;

            const subject: string = interaction.options.getString('subject')?.toLowerCase() || "COMP";
            const fir_class: string = interaction.options.getString('catalog_number1') || "110";
            const sec_class: string | null = interaction.options.getString('catalog_number2') || null;
            const thi_class: string | null = interaction.options.getString('catalog_number3') || null;

            if (year < 2023) {

                show_class_before_sp_23(subject, fir_class, semester, year, itchid);
                if (sec_class) {
                    show_class_before_sp_23(subject, sec_class, semester, year, itchid);
                }
                if (thi_class) {
                    show_class_before_sp_23(subject, thi_class, semester, year, itchid);
                }


                await interaction.reply("Gimme a sec");


            } else {

                show_class(subject, fir_class, semester, year, itchid);
                if (sec_class) {
                    show_class(subject, sec_class, semester, year, itchid);
                }
                if (thi_class) {
                    show_class(subject, thi_class, semester, year, itchid);
                }

                await interaction.reply("Gimme a sec");
            }
        } break;

        case 'prof': {

            const itchid: string = interaction.channelId;
            const subject: string | any = interaction.options.getString('subject');
            const prof_id: number | any = interaction.options.getInteger('prof_id');

            show_prof(subject, itchid, prof_id);
            await interaction.reply("Gimme a sec");

        } break;

        case 'help': {

            const ret = "```(Default: Fall 2023)\n\n" +
                "\"/class\" for 1 or more classes of common subject\n\n" +
                "\"/prof\" to show a prof's teaching schedule \n\n" +
                "\"/level\" to show classes at a specific level (100, 200, 300 etc.) \n\n" +
                "\"/gunfight\" to time somebody out for 10 secs \n\n" +
                "Source Code:\nhttps://github.com/kyeou/CSUN-Catalog-and-Schedules```";

            await interaction.reply(ret);

        } break;

        case 'level': {

            const itchid: string = interaction.channelId;
            const subject: string | any = interaction.options.getString('subject');
            const level: number | any = interaction.options.getInteger('level');

            show_levels(subject, level, itchid);

            await interaction.reply("Gimme a sec");

        } break;

        case 'gunfight': {

            const user = interaction.options.getUser('target') || { username: "", id: "" };

            const member: any = interaction.guild?.members.cache.get(user.id);
            if (member && member.id !== "534510030490304524") {
                member.timeout(10000, "bleh");
                interaction.reply(`\`\`\`${user?.username} has been timed out!\`\`\``);
            } else {
                interaction.reply('```Kyeou is immune.```');
            }
        }
    }
});
client.login(token);

