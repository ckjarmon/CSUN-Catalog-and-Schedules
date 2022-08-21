require('dotenv').config()
const {
  Client,
  GatewayIntentBits
} = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

});

// client.on('messageCreate', message => {
//   console.log(message.content);
// });

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  //interaction.deferReply();
  const {
    commandName
  } = interaction;

  if (commandName === 'class') {

    //await interaction.reply(interaction.options.getString('subject').toUpperCase() + " " +  interaction.options.getString('catalog_number'));
    //https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/courses/comp
    var ret = "";


    require("request")({
      url: 'https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/courses/' + interaction.options.getString('subject').toLowerCase(),
      json: true
    }, async function (error, response, body) {

      if (!error && response.statusCode === 200) {
        //console.log(body); //Print the json response
        const stuffs = JSON.parse(JSON.stringify(body));
        //console.log(stuffs.courses[0].title)
        //ret += stuffs.courses[0];
        stuffs.courses.forEach(element => {
          if (element.catalog_number === interaction.options.getString('catalog_number')) {
            ret = ret.concat(element.subject + " " + element.catalog_number + " " + element.title + "\n\n" + element.description + "\n\n" + element.subject + " " + element.catalog_number + " " + element.title);
            let currentDate = new Date();

            ret = ret.concat(" - FALL 2022 - As of ");
            if (String(currentDate.getHours()).length === 1) {
              ret = ret.concat("0" + currentDate.getHours() + ":");
            } else {
              ret = ret.concat(currentDate.getHours() + ":");
            }

            if (String(currentDate.getMinutes()).length === 1) {
              ret = ret.concat("0" + currentDate.getMinutes() + ":");
            } else {
              ret = ret.concat(currentDate.getMinutes() + ":");
            }

            if (String(currentDate.getSeconds()).length === 1) {
              ret = ret.concat("0" + currentDate.getSeconds() + ":");
            } else {
              ret = ret.concat(currentDate.getSeconds());
            }

            ret = ret.concat("\n");
          }
        });


      }
    }); //end request

    require("request")({
      url: 'https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/classes/' + interaction.options.getString('subject').toLowerCase(),
      json: true
    }, async function (error, response, body) {

      if (!error && response.statusCode === 200) {
        //console.log(body); //Print the json response
        const stuffs = JSON.parse(JSON.stringify(body));
        //console.log(stuffs.courses[0].title)
        //ret += stuffs.courses[0];
        ret = ret.concat("\n\tSection\t\tLocation\t\tDays\t\t  Seats\t\t\t  Time\t\t\t\t\tFaculty\n\t-------\t\t--------\t\t----\t\t  -----\t\t\t  ----\t\t\t\t\t-------\n");
        stuffs.classes.forEach(element => {
          if (element.catalog_number === interaction.options.getString('catalog_number') && element.meetings.length > 0) {
            ret = ret.concat("\t " + element.class_number);
            //console.log(element.meetings[0].location);
            if (element.meetings[0].location.length === 5) {
              ret = ret.concat("\t\t   " + element.meetings[0].location);
            } else {
              ret = ret.concat("\t\t  " + element.meetings[0].location);
            }

            if (element.meetings[0].days.length === 1) {
              ret = ret.concat("\t\t   " + element.meetings[0].days);
            } else if (element.meetings[0].days.length === 2 || element.meetings[0].days.length === 3) {
              ret = ret.concat("\t\t  " + element.meetings[0].days);
            } else {
              ret = ret.concat("\t\t " + element.meetings[0].days);
            }



            ret = ret.concat("\t\t\t " + (element.enrollment_cap - element.enrollment_cap) + "\t\t\t");
            ret = ret.concat(element.meetings[0].start_time.substring(0, 2) + ":" + element.meetings[0].start_time.substring(2, 4));
            ret = ret.concat(" - ");
            ret = ret.concat(element.meetings[0].end_time.substring(0, 2) + ":" + element.meetings[0].end_time.substring(2, 4));

            if (element.instructors.length > 0) {
              ret = ret.concat("\t\t" + element.instructors[0].instructor);
            } else {
              ret = ret.concat("\t\t\t\tStaff");
            }

            ret = ret.concat("\n");
          }
        });

      } //end if

      await interaction.editReply("```" + ret + "```").catch(err => {});
    }); //end request


  }
  else if (commandName === 'help') {
    let ret = "```\"/class\" for schedule of a specific class \n\nSource Code: \
    \nhttps://github.com/kyeou/Python-Scripts/tree/main/csun_catalog_and_schedules_bot```";
    await interaction.reply(ret);
  }

});

client.login(process.env.DISCORD_TOKEN);