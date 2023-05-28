import axios from "axios";
import { ArgumentParser } from "argparse";
import { Client, GatewayIntentBits, Message, GuildEmoji } from "discord.js";
import fs from "fs";
import path from "path";

const parser = new ArgumentParser();

parser.add_argument("--config", {
	nargs: "?",
	type: String,
	help: "Path to config file"
});

const args = parser.parse_args();

const { token } = require(args.config ? path.resolve(args.config) : "../../config.json");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers
	]
});

client.on("ready", () => {
	console.log(`Logged in as ${client.user!.tag}!`);
});

const getCurrentDateAndTime = (): string => {
	const options: Intl.DateTimeFormatOptions = {
		weekday: "short",
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZone: "PST",
		timeZoneName: "short"
	};

	const currentDate = new Date();
	const formattedDate = new Intl.DateTimeFormat("en-US", options).format(currentDate);

	return ` - As of ${formattedDate}`;
};

async function send_msg(msg: string, interaction: any): Promise<void> {
	// await (<TextChannel>client.channels.cache.get(channel)).send("```" + msg.substring(0, 1993) + "```");
	// if (msg.substring(1994) !== "") {
	//     await (<TextChannel>client.channels.cache.get(channel)).send("```" + msg.substring(1994) + "```")
	// };

	await interaction.followUp("```" + msg.substring(0, 1994) + "```");
	if (msg.substring(1994) !== "") {
		await interaction.followUp("```" + msg.substring(1994) + "```");
	}
}

async function show_prof(_OPTIONS: {
	subject: string;
	id: number | null;
	interaction: any;
}): Promise<void> {
	const { subject, id, interaction } = _OPTIONS;

	const baseUrl: string = "http://127.0.0.1:2222/profs/";
	const url: string = id ? `${baseUrl}${subject}/${id}` : `${baseUrl}${subject}`;
	const professor_entry: Promise<string> = new Promise<string>(async (resolve, reject) => {
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

				ret1 += "\n\tSection\tSubject\t Class\t\t Days\t\t  Seats\t\t\t  Time\t\t\t\tLocation";
				ret1 += "\n\t-------\t-------\t-------\t\t----\t\t  -----\t\t\t  ----\t\t\t\t--------\n";

				body.schedule.forEach(
					(course: {
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
						ret1 += `\t ${course.class_number}`;

						ret1 +=
							course.subject.length === 4
								? `\t   ${course.subject}`
								: `\t   ${course.subject} `;
						ret1 +=
							course.catalog_number.length === 4
								? `\t   ${course.catalog_number}`
								: `\t   ${course.catalog_number} `;
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
						} else {
							ret1 += "  --";
						}

						const enrollmentCount: number = course.enrollment_cap - course.enrollment_count;
						ret1 += `${
							enrollmentCount.toString().length < 10
								? `\t\t\t${enrollmentCount}\t\t\t`
								: `\t\t\t ${enrollmentCount}\t\t\t`
						}`;

						ret1 += `${course.start_time.substring(0, 2)}:${course.start_time.substring(
							2,
							4
						)}`;
						ret1 += " - ";
						ret1 += `${course.end_time.substring(0, 2)}:${course.end_time.substring(2, 4)}`;

						if (course.location.length === 3) {
							ret1 += "   ";
						} else {
							ret1 +=
								course.location.length === 5
									? `\t\t   ${course.location}`
									: `\t\t  ${course.location}`;
						}
						ret1 += "\n";
					}
				);
			}
			ret1 += `\n${getCurrentDateAndTime()}\n`;
			resolve(ret1);
		} catch (e) {
			reject(e);
		}
	});

	const settled_string: string = await professor_entry;

	await send_msg(settled_string, interaction);
}

// simply returns all classes at a specified level
async function show_levels(_OPTIONS: {
	subject: string;
	level: number;
	interaction: any;
}): Promise<void> {
	console.log("Show levels called.");
	const { subject, level, interaction } = _OPTIONS;

	const levels: Promise<string> = new Promise<string>(async (resolve, reject) => {
		let ret1: string = "";
		try {
			const response = await axios.get(`http://127.0.0.1:2222/${subject}/levels/${level}`);
			const body = response.data;

			ret1 += `${subject.toUpperCase()} ${level.toString().padEnd(3, "0")}-level classes\n`;

			ret1 += "-".repeat(body.length);

			ret1 += "\n";

			body.forEach((course: string) => {
				ret1 += `${course}\n`;
			});
			resolve(ret1);
		} catch (e) {
			reject(e);
		}
	});

	const settled_string: string = await levels;

	// await send_msg(settled_string, interaction);
	await interaction.editReply("```" + settled_string.substring(0, 1994) + "```");
}

/* for every class >= String 2023 */
async function show_class(_OPTIONS: {
	subject: string;
	catalog_number: string;
	semester: string;
	year: number;
	interaction: any;
}): Promise<void> {
	console.log("Show class called.");
	const { subject, catalog_number, semester, year, interaction } = _OPTIONS;
	const catalog_entry: Promise<string> = new Promise<string>(async (resolve, reject) => {
		let ret1: string = "";

		try {
			const catalogResponse = await axios.get(
				`http://127.0.0.1:2222/${subject}-${catalog_number}/catalog`
			);
			const course = catalogResponse.data;

			ret1 += `${course.subject} ${course.catalog_number} ${course.title}\n\n${
				course.description
			}\n\n${course.subject} ${course.catalog_number} ${
				course.title
			} - ${semester.toUpperCase()} ${year}`;

			ret1 += getCurrentDateAndTime() + "\n";
		} catch (error) {
			console.error(error);
			reject(error);
		}

		resolve(ret1);
	});

	const schedule: Promise<string> = new Promise<string>(async (resolve, reject) => {
		try {
			let ret2: string = "";
			const scheduleResponse = await axios.get(
				`http://127.0.0.1:2222/${subject}-${catalog_number}/${semester.toLowerCase()}-${year}/schedule`
			);
			const courses = scheduleResponse.data;

			ret2 +=
				"\n\tSection\t\t\tDays\t\t  Seats\t\t Waitlist Queue\t\t\t  Time\t\t\t\t\tFaculty\t\t\tLocation";
			ret2 +=
				"\n\t-------\t\t\t----\t\t  -----\t\t --------------\t\t\t  ----\t\t\t\t\t-------\t\t\t--------\n";

			courses.forEach(
				(course: {
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
					end_time: string;
				}) => {
					ret2 += `\t ${course.class_number}`;

					if (course.days !== null) {
						switch (course.days.length) {
							case 1:
								ret2 += `\t\t\t   ${course.days}`;
								break;
							case 2:
							case 3:
								ret2 += `\t\t\t  ${course.days}`;
								break;
							default:
								ret2 += `\t\t\t ${course.days}`;
								break;
						}
					} else {
						ret2 += "\t\t  --";
					}

					const seats = course.enrollment_cap - course.enrollment_count;
					ret2 += seats.toString().length < 10 ? `\t\t\t ${seats}` : `\t\t\t  ${seats}`;

					if (course.waitlist_cap > 0) {
						const waitlistCount =
							course.waitlist_count > 10
								? course.waitlist_count
								: ` ${course.waitlist_count}`;
						ret2 += `\t\t\t    ${waitlistCount}\t`;
					} else {
						ret2 += `\t\t\t    N/A   `;
					}

					ret2 += `\t\t\t${course.start_time.substring(0, 2)}:${course.start_time.substring(
						2,
						4
					)} - ${course.end_time.substring(0, 2)}:${course.end_time.substring(2, 4)}`;

					ret2 +=
						course.instructor !== "Staff" ? `\t\t\t${course.instructor}` : `\t\t\t\tStaff`;

					if (course.location.length === 5) {
						ret2 += `\t\t   ${course.location}`;
					} else if (course.location.length > 5) {
						ret2 += `\t\t  ${course.location}`;
					} else {
						ret2 += `\t\t     ${course.location}`;
					}

					ret2 += "\n";
				}
			);
			resolve(ret2);
		} catch (error) {
			reject(error);
		}
	});

	const settled_string: string = (await Promise.all([catalog_entry, schedule])).join("");

	await send_msg(settled_string, interaction);
}

// for every class <= Fall 2022
async function show_class_before_sp_23(_OPTIONS: {
	subject: string;
	catalog_number: string;
	semester: string;
	year: number;
	interaction: any;
}): Promise<void> {
	console.log("Show class override called.");
	const { subject, catalog_number, semester, year, interaction } = _OPTIONS;

	const catalog_entry: Promise<string> = new Promise<string>(async (resolve, reject) => {
		let ret1: string = "";

		try {
			const catalogResponse = await axios.get(
				`http://127.0.0.1:2222/${subject}-${catalog_number}/catalog`
			);
			console.log(`http://127.0.0.1:2222/${subject}-${catalog_number}/catalog`);

			const course: {
				catalog_number: number;
				subject: string;
				title: string;
				description: string;
			} = catalogResponse.data;

			ret1 += `${course.subject} ${course.catalog_number} ${course.title}\n\n${course.description}\n\n`;
			ret1 += `${course.subject} ${course.catalog_number} ${
				course.title
			} - ${semester.toUpperCase()} ${year}`;

			ret1 += getCurrentDateAndTime() + "\n";

			resolve(ret1);
		} catch (e) {
			reject(e);
		}
	});

	const schedule: Promise<string> = new Promise<string>(async (resolve, reject) => {
		let ret2: string = "";

		try {
			const classesResponse = await axios.get(
				`https://api.metalab.csun.edu/curriculum/api/2.0/terms/${semester[0].toUpperCase()}${semester.substring(
					1
				)}-${year}/classes/${subject}`
			);
			console.log(
				`https://api.metalab.csun.edu/curriculum/api/2.0/terms/${semester[0].toUpperCase()}${semester.substring(
					1
				)}-${year}/classes/${subject}`
			);

			const stuffs2 = classesResponse.data;

			ret2 += "\n\tSection\t\tDays\t\t  Seats\t\t\t  Time\t\t\t\t\tFaculty\t\t\t\tLocation";
			ret2 += "\n\t-------\t\t----\t\t  -----\t\t\t  ----\t\t\t\t\t-------\t\t\t\t--------\n";

			stuffs2.classes.forEach(
				(course: {
					catalog_number: number;
					class_number: string;
					enrollment_cap: number;
					enrollment_count: number;
					meetings: {
						location: string;
						start_time: string;
						end_time: string;
						days: string;
					}[];
					instructors: { instructor: string }[];
				}) => {
					if (
						course.catalog_number.toString() === catalog_number &&
						course.meetings.length > 0
					) {
						ret2 += `\t ${course.class_number}`;

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

						ret2 +=
							`${course.enrollment_cap - course.enrollment_count}`.length < 10
								? `\t\t\t${course.enrollment_cap - course.enrollment_count}`
								: `\t\t\t ${course.enrollment_cap - course.enrollment_count}`;

						ret2 += `\t\t\t${course.meetings[0].start_time.substring(
							0,
							2
						)}:${course.meetings[0].start_time.substring(2, 4)}`;
						ret2 += " - ";
						ret2 += `${course.meetings[0].end_time.substring(
							0,
							2
						)}:${course.meetings[0].end_time.substring(2, 4)}`;

						ret2 +=
							course.instructors.length > 0
								? `\t\t${course.instructors[0].instructor}`
								: "\t\t\tStaff";

						ret2 +=
							course.meetings[0].location.length === 5
								? `\t\t   ${course.meetings[0].location}`
								: `\t\t  ${course.meetings[0].location}`;

						ret2 += "\n";
						// ret2 += course.meetings[0].location.length === 3 ? "   " : "";
					}
				}
			);
			resolve(ret2);
		} catch (e) {
			reject(e);
		}
	});

	const settled_string: string = (await Promise.all([catalog_entry, schedule])).join("");

	await send_msg(settled_string, interaction);
}

client.on("messageCreate", async (message: Message) => {
	const _message: string = message.content;
	// console.log(message.content)
	// console.log(message.author)
	// console.log(client.user)

	if (message.author.id !== client.user?.id) {
		const emojiRegex: RegExp = /<:[a-zA-Z0-9]*:[0-9]*>/g;
		const emojiMatches: RegExpMatchArray | null = _message.match(emojiRegex);
		// console.log(emojiMatches)

		if (emojiMatches !== null) {
			emojiMatches.forEach((match: string) => {
				const emojiId: RegExpMatchArray | null = match.match(/[0-9]+/);
				const emoji: GuildEmoji | undefined = client.emojis.cache.get(emojiId![0]);
				// console.log(emojiId)
				if (emoji !== undefined) {
					const ec: { [key: string]: number } = JSON.parse(
						fs.readFileSync(
							"/home/kyeou/CSUN-Catalog-And-Schedules/emoji_count.json",
							"utf8"
						)
					);

					ec[match] = ec[match] ? ec[match] + 1 : 1;

					const sortedEC: { [key: string]: number } = Object.fromEntries(
						Object.entries(ec).sort((a, b) => b[1] - a[1])
					);

					// console.log(sortedEC)

					fs.writeFileSync(
						"/home/kyeou/CSUN-Catalog-And-Schedules/emoji_count.json",
						JSON.stringify(sortedEC, null, 4)
					);
				}
			});
		}
	}
});

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

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	await interaction.deferReply();

	switch (commandName) {
		case "class":
			{
				const semester: string = interaction.options.getString("semester") || "fall";
				const year: number = interaction.options.getInteger("year") || 2023;

				const subject: string =
					interaction.options.getString("subject")?.toLowerCase() || "COMP";

				const first_catalog_number: string =
					interaction.options.getString("catalog_number1") || "110";
				const second_catalog_number: string | null =
					interaction.options.getString("catalog_number2") || null;
				const third_catalog_number: string | null =
					interaction.options.getString("catalog_number3") || null;

				const classes: Promise<void>[] = [];

				const push_classes = (year: number, catalog_numbers: (string | null)[]) => {
					const func = year >= 2023 ? show_class : show_class_before_sp_23;
					catalog_numbers
						.filter((cat_num: string | null) => cat_num !== null)
						.forEach((catalog_number: string | null) => {
							classes.push(
								func({
									subject,
									catalog_number: catalog_number!,
									semester,
									year,
									interaction
								})
							);
						});
				};

				push_classes(year, [first_catalog_number, second_catalog_number, third_catalog_number]);

				await interaction.editReply("Gimme a sec");
				await Promise.all(classes);
			}
			break;

		case "prof":
			{
				const subject: string = interaction.options.getString("subject")!;
				const prof_id: number | null = interaction.options.getInteger("prof_id");

				await show_prof({ subject: subject, id: prof_id, interaction: interaction });
				// await interaction.reply("Gimme a sec");
			}
			break;

		case "help":
			{
				const ret =
					"```(Default: Fall 2023)\n\n" +
					'"/class" for 1 or more classes of common subject\n\n' +
					'"/prof" to show a prof\'s teaching schedule \n\n' +
					'"/level" to show classes at a specific level (100, 200, 300 etc.) \n\n' +
					'"/gunfight" to time somebody out for 10 secs \n\n' +
					"Source Code:\nhttps://github.com/kyeou/CSUN-Catalog-and-Schedules```";

				await interaction.reply(ret);
			}
			break;

		case "level":
			{
				const subject: string | any = interaction.options.getString("subject");
				const level: number | any = interaction.options.getInteger("level");

				await show_levels({ subject: subject, level: level, interaction: interaction });

				// await interaction.reply("Gimme a sec");
			}
			break;

		case "emoji":
			{
				const ret: string[] = ["```Emote Rankings```"];
				const ec: { [key: string]: number } = JSON.parse(
					fs.readFileSync("/home/kyeou/CSUN-Catalog-And-Schedules/emoji_count.json", "utf8")
				);
				const topEmotes: [string, number][] = Object.entries(ec).slice(0, 15);

				for (const [emote, count] of topEmotes) {
					ret.push(`${emote} ${count}`);
				}

				const retMessage: string = ret.join("\n");
				// console.log(retMessage);

				await interaction.editReply(retMessage.slice(0, 1979));
				// await interaction.followUp(retMessage.slice(1979));
			}
			break;

		case "gunfight": {
			const user = interaction.options.getUser("target") || { username: "", id: "" };

			const member: any = interaction.guild?.members.cache.get(user.id);
			if (member && member.id !== "534510030490304524") {
				member.timeout(10000, "bleh");
				await interaction.reply(`\`\`\`${user?.username} has been timed out!\`\`\``);
			} else {
				await interaction.reply("```Kyeou is immune.```");
			}
		}
	}
});
client.login(token);
