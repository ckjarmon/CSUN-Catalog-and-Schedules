"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const config_json_1 = require("./config.json");
const argparse_1 = require("argparse");
const discord_js_1 = require("discord.js");
const fs_1 = tslib_1.__importDefault(require("fs"));
const parser = new argparse_1.ArgumentParser();
parser.add_argument('--project_location', {
    nargs: '?',
    type: String,
    help: 'Path to config file',
});
const args = parser.parse_args();
if (args.project_location) {
    process.chdir(path.resolve(args.project_location));
}
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildMembers]
});
client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});
const getCurrentDateAndTime = () => {
    const options = {
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
async function send_msg(msg, interaction) {
    await interaction.editReply("```" + msg.substring(0, 1994) + "```");
    if (msg.substring(1994) !== "") {
        await interaction.followUp("```" + msg.substring(1994) + "```");
    }
    ;
}
async function show_prof(subject, id, interaction) {
    const baseUrl = "http://127.0.0.1:2222/profs/";
    const url = id ? `${baseUrl}${subject}/${id}` : `${baseUrl}${subject}`;
    new Promise(async (resolve, reject) => {
        let ret1 = "";
        try {
            const response = await axios_1.default.get(url);
            const { data: body } = response;
            if (!id) {
                ret1 = String(body).replace(/,/g, "");
            }
            else {
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
                ret1 += "\n\tSection\tSubject\t Class\t\t Location\t\tDays\t\t  Seats\t\t\t  Time";
                ret1 += "\n\t-------\t-------\t-------\t\t--------\t\t----\t\t  -----\t\t\t  ----\n";
                body.sch.forEach((course) => {
                    ret1 += `\t ${course.class_number}`;
                    ret1 += course.subject.length === 4 ? `\t   ${course.subject}` : `\t   ${course.subject} `;
                    ret1 += course.catalog_number.length === 4 ? `\t   ${course.catalog_number}` : `\t   ${course.catalog_number} `;
                    if (course.location.length === 3) {
                        ret1 += "   ";
                    }
                    else {
                        ret1 += course.location.length === 5 ? `\t\t   ${course.location}` : `\t\t  ${course.location}`;
                    }
                    if (course.days !== "None") {
                        switch (course.days.length) {
                            case 1:
                                ret1 += `\t\t   ${course.days}`;
                                break;
                            case 2:
                                ret1 += `\t\t  ${course.days}`;
                                break;
                            case 3:
                                ret1 += `\t\t  ${course.days}`;
                                break;
                            default:
                                ret1 += `\t\t ${course.days}`;
                        }
                    }
                    else {
                        ret1 += "  --";
                    }
                    const enrollmentCount = course.enrollment_cap - course.enrollment_count;
                    ret1 += `${enrollmentCount.toString().length < 10 ? `\t\t\t${enrollmentCount}\t\t\t` : `\t\t\t ${enrollmentCount}\t\t\t`}`;
                    ret1 += `${course.start_time.substring(0, 2)}:${course.start_time.substring(2, 4)}`;
                    ret1 += " - ";
                    ret1 += `${course.end_time.substring(0, 2)}:${course.end_time.substring(2, 4)}`;
                    ret1 += "\n";
                });
            }
            ret1 += `\n${getCurrentDateAndTime()}\n`;
            resolve(ret1);
        }
        catch (e) {
            reject(e);
        }
    }).then(async (res) => {
        await send_msg(res, interaction);
    });
}
async function show_levels(subject, level, interaction) {
    console.log("Show levels called.");
    new Promise(async (resolve, reject) => {
        let ret1 = "";
        try {
            const response = await axios_1.default.get(`http://127.0.0.1:2222/${subject}/levels/${level}`);
            const body = response.data;
            ret1 += `${subject.toUpperCase()} ${level.toString().padEnd(3, '0')}-level classes\n`;
            ret1 += "-".repeat(body.length);
            ret1 += ("\n");
            body.forEach((course) => {
                ret1 += (`${course}\n`);
            });
            resolve(ret1);
        }
        catch (e) {
            reject(e);
        }
    }).then(async (res) => {
        await send_msg(res, interaction);
    });
}
async function show_class(subject, code, semester, year, interaction) {
    new Promise(async (resolve, reject) => {
        let ret1 = "", ret2 = "";
        console.log("Show class called.");
        try {
            const catalogResponse = await axios_1.default.get(`http://127.0.0.1:2222/${subject}-${code}/catalog`);
            const course = catalogResponse.data;
            ret1 += `${course.subject} ${course.catalog_number} ${course.title}\n\n${course.description}\n\n${course.subject} ${course.catalog_number} ${course.title} - ${semester.toUpperCase()} ${year}`;
            ret1 += getCurrentDateAndTime() + "\n";
        }
        catch (error) {
            console.error(error);
            reject(error);
        }
        try {
            const scheduleResponse = await axios_1.default.get(`http://127.0.0.1:2222/${subject}-${code}/${semester.toLowerCase()}-${year}/schedule`);
            const courses = scheduleResponse.data;
            ret2 += "\n\tSection\t\tLocation\t\tDays\t\t  Seats\t\t Waitlist Queue\t\t\t  Time\t\t\t\t\tFaculty";
            ret2 += "\n\t-------\t\t--------\t\t----\t\t  -----\t\t --------------\t\t\t  ----\t\t\t\t\t-------\n";
            courses.forEach((course) => {
                ret2 += `\t ${course.class_number}`;
                if (course.location.length === 5) {
                    ret2 += `\t\t   ${course.location}`;
                }
                else if (course.location.length > 5) {
                    ret2 += `\t\t  ${course.location}`;
                }
                else {
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
                }
                else {
                    ret2 += ("\t\t  --");
                }
                const seats = (course.enrollment_cap - course.enrollment_count);
                ret2 += (seats.toString().length < 10) ? `\t\t\t ${seats}` : `\t\t\t  ${seats}`;
                if (course.waitlist_cap > 0) {
                    const waitlistCount = course.waitlist_count > 10 ? course.waitlist_count : ` ${course.waitlist_count}`;
                    ret2 += `\t\t\t    ${waitlistCount}\t`;
                }
                else {
                    ret2 += `\t\t\t    N/A   `;
                }
                ret2 += `\t\t\t${course.start_time.substring(0, 2)}:${course.start_time.substring(2, 4)} - ${course.end_time.substring(0, 2)}:${course.end_time.substring(2, 4)}`;
                ret2 += (course.instructor !== "Staff")
                    ? `\t\t\t${course.instructor}`
                    : `\t\t\t\tStaff`;
                ret2 += "\n";
            });
            resolve(ret1 + ret2);
        }
        catch (error) {
            reject(error);
        }
    }).then(async (res) => {
        await send_msg(res, interaction);
    });
}
async function show_class_before_sp_23(subject, code, semester, year, interaction) {
    console.log("Show class override called.");
    new Promise(async (resolve, reject) => {
        let ret1 = "", ret2 = "";
        try {
            const catalogResponse = await axios_1.default.get(`http://127.0.0.1:2222/${subject}-${code}/catalog`);
            console.log(`http://127.0.0.1:2222/${subject}-${code}/catalog`);
            const stuffs = catalogResponse.data;
            stuffs.forEach((course) => {
                if (course.catalog_number.toString() === code) {
                    ret1 += `${course.subject} ${course.catalog_number} ${course.title}\n\n${course.description}\n\n`;
                    ret1 += `${course.subject} ${course.catalog_number} ${course.title} - ${semester.toUpperCase()} ${year}`;
                    ret1 += getCurrentDateAndTime() + "\n";
                }
            });
            const classesResponse = await axios_1.default.get(`https://api.metalab.csun.edu/curriculum/api/2.0/terms/${semester}-${year}/classes/${subject}`);
            console.log(`https://api.metalab.csun.edu/curriculum/api/2.0/terms/${semester}-${year}/classes/${subject}`);
            const stuffs2 = classesResponse.data;
            ret2 += "\n\tSection\t\tLocation\t\tDays\t\t  Seats\t\t\t  Time\t\t\t\t\tFaculty";
            ret2 += "\n\t-------\t\t--------\t\t----\t\t  -----\t\t\t  ----\t\t\t\t\t-------\n";
            stuffs2.classes.forEach((course) => {
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
                        ? `\t\t\t${course.instructors[0].instructor}`
                        : "\t\t\t\tStaff";
                    ret2 += ("\n");
                }
            });
            resolve(ret1 + ret2);
        }
        catch (e) {
            reject(e);
        }
    }).then(async (res) => {
        await send_msg(res, interaction);
    });
}
client.on('messageCreate', async (message) => {
    const _message = message.content;
    if (message.author.id !== client.user?.id) {
        const emojiRegex = /<:[a-zA-Z0-9]*:[0-9]*>/g;
        const emojiMatches = _message.match(emojiRegex);
        if (emojiMatches !== null) {
            emojiMatches.forEach((match) => {
                const emojiId = match.match(/[0-9]+/);
                const emoji = client.emojis.cache.get(emojiId[0]);
                if (emoji !== undefined) {
                    const ec = JSON.parse(fs_1.default.readFileSync('./emoji_count.json', 'utf8'));
                    ec[match] = (ec[match]) ? ec[match] + 1 : 1;
                    const sortedEC = Object.fromEntries(Object.entries(ec).sort((a, b) => b[1] - a[1]));
                    fs_1.default.writeFileSync('./emoji_count.json', JSON.stringify(sortedEC, null, 4));
                }
            });
        }
    }
});
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    const { commandName } = interaction;
    await interaction.deferReply();
    switch (commandName) {
        case 'class':
            {
                const itchid = interaction.channelId;
                const semester = interaction.options.getString('semester') || 'fall';
                const year = interaction.options.getInteger('year') || 2023;
                const subject = interaction.options.getString('subject')?.toLowerCase() || "COMP";
                const fir_class = interaction.options.getString('catalog_number1') || "110";
                const sec_class = interaction.options.getString('catalog_number2') || null;
                const thi_class = interaction.options.getString('catalog_number3') || null;
                if (year < 2023) {
                    await show_class_before_sp_23(subject, fir_class, semester, year, interaction);
                    if (sec_class) {
                        await show_class_before_sp_23(subject, sec_class, semester, year, interaction);
                    }
                    if (thi_class) {
                        await show_class_before_sp_23(subject, thi_class, semester, year, interaction);
                    }
                }
                else {
                    await show_class(subject, fir_class, semester, year, interaction);
                    if (sec_class) {
                        await show_class(subject, sec_class, semester, year, interaction);
                    }
                    if (thi_class) {
                        await show_class(subject, thi_class, semester, year, interaction);
                    }
                }
            }
            break;
        case 'prof':
            {
                const itchid = interaction.channelId;
                const subject = interaction.options.getString('subject');
                const prof_id = interaction.options.getInteger('prof_id');
                await show_prof(subject, prof_id, interaction);
            }
            break;
        case 'help':
            {
                const ret = "```(Default: Fall 2023)\n\n" +
                    "\"/class\" for 1 or more classes of common subject\n\n" +
                    "\"/prof\" to show a prof's teaching schedule \n\n" +
                    "\"/level\" to show classes at a specific level (100, 200, 300 etc.) \n\n" +
                    "\"/gunfight\" to time somebody out for 10 secs \n\n" +
                    "Source Code:\nhttps://github.com/kyeou/CSUN-Catalog-and-Schedules```";
                await interaction.reply(ret);
            }
            break;
        case 'level':
            {
                const itchid = interaction.channelId;
                const subject = interaction.options.getString('subject');
                const level = interaction.options.getInteger('level');
                await show_levels(subject, level, interaction);
            }
            break;
        case 'emoji':
            {
                const ret = ["```Emote Rankings```"];
                const ec = JSON.parse(fs_1.default.readFileSync('./emoji_count.json', 'utf8'));
                const topEmotes = Object.entries(ec).slice(0, 15);
                for (const [emote, count] of topEmotes) {
                    ret.push(`${emote} ${count}`);
                }
                const retMessage = ret.join('\n');
                await interaction.editReply(retMessage.slice(0, 1979));
            }
            break;
        case 'gunfight': {
            const user = interaction.options.getUser('target') || { username: "", id: "" };
            const member = interaction.guild?.members.cache.get(user.id);
            if (member && member.id !== "534510030490304524") {
                member.timeout(10000, "bleh");
                await interaction.reply(`\`\`\`${user?.username} has been timed out!\`\`\``);
            }
            else {
                await interaction.reply('```Kyeou is immune.```');
            }
        }
    }
});
client.login(config_json_1.token);
