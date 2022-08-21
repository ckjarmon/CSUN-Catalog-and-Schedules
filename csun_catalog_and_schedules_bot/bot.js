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
  //
  const {
    commandName
  } = interaction;

  if (commandName === 'class') {
    //interaction.deferReply();

    itchid = interaction.channelId;
    //await interaction.reply(interaction.options.getString('subject').toUpperCase() + " " +  interaction.options.getString('catalog_number'));
    //https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/courses/comp
    
    var subject = "",fir_class = "", sec_class = "", thi_class = "";
    subject = interaction.options.getString('subject').toLowerCase();

    fir_class = interaction.options.getString('catalog_number');

    if (interaction.options.getString('catalog_number1')) {
      sec_class =interaction.options.getString('catalog_number1');
    }

    if (interaction.options.getString('catalog_number2')) {
      thi_class =interaction.options.getString('catalog_number2');
    }


    var ret1 = "";
    require("request")({
      url: 'https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/courses/' + subject,
      json: true
    }, async function (error, response, body) {

      if (!error && response.statusCode === 200) {
        //console.log(body); //Print the json response
        const stuffs = JSON.parse(JSON.stringify(body));
        //console.log(stuffs.courses[0].title)
        //ret += stuffs.courses[0];
        stuffs.courses.forEach(element => {
          if (element.catalog_number === fir_class) {
            ret1 = ret1.concat(element.subject + " " + element.catalog_number + " " + element.title + "\n\n" + element.description + "\n\n" + element.subject + " " + element.catalog_number + " " + element.title);
            let currentDate = new Date();

            ret1 = ret1.concat(" - FALL 2022 - As of ");
            if (String(currentDate.getHours()).length === 1) {
              ret1 = ret1.concat("0" + currentDate.getHours() + ":");
            } else {
              ret1 = ret1.concat(currentDate.getHours() + ":");
            }

            if (String(currentDate.getMinutes()).length === 1) {
              ret1 = ret1.concat("0" + currentDate.getMinutes() + ":");
            } else {
              ret1 = ret1.concat(currentDate.getMinutes() + ":");
            }

            if (String(currentDate.getSeconds()).length === 1) {
              ret1 = ret1.concat("0" + currentDate.getSeconds() + ":");
            } else {
              ret1 = ret1.concat(currentDate.getSeconds());
            }

            ret1 = ret1.concat("\n");
          }
        });


      }
    }); //end request

    require("request")({
      url: 'https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/classes/' + subject,
      json: true
    }, async function (error, response, body) {

      if (!error && response.statusCode === 200) {
        //console.log(body); //Print the json response
        const stuffs = JSON.parse(JSON.stringify(body));
        //console.log(stuffs.courses[0].title)
        //ret += stuffs.courses[0];
        ret1 = ret1.concat("\n\tSection\t\tLocation\t\tDays\t\t  Seats\t\t\t  Time\t\t\t\t\tFaculty\n\t-------\t\t--------\t\t----\t\t  -----\t\t\t  ----\t\t\t\t\t-------\n");
        stuffs.classes.forEach(element => {
          if (element.catalog_number === fir_class && element.meetings.length > 0) {
            ret1 = ret1.concat("\t " + element.class_number);
            //console.log(element.meetings[0].location);
            if (element.meetings[0].location.length === 5) {
              ret1 = ret1.concat("\t\t   " + element.meetings[0].location);
            } else {
              ret1 = ret1.concat("\t\t  " + element.meetings[0].location);
            }

            if (element.meetings[0].days.length === 1) {
              ret1 = ret1.concat("\t\t   " + element.meetings[0].days);
            } else if (element.meetings[0].days.length === 2 || element.meetings[0].days.length === 3) {
              ret1 = ret1.concat("\t\t  " + element.meetings[0].days);
            } else {
              ret1 = ret1.concat("\t\t " + element.meetings[0].days);
            }



            ret1 = ret1.concat("\t\t\t " + (element.enrollment_cap - element.enrollment_cap) + "\t\t\t");
            ret1 = ret1.concat(element.meetings[0].start_time.substring(0, 2) + ":" + element.meetings[0].start_time.substring(2, 4));
            ret1 = ret1.concat(" - ");
            ret1 = ret1.concat(element.meetings[0].end_time.substring(0, 2) + ":" + element.meetings[0].end_time.substring(2, 4));

            if (element.instructors.length > 0) {
              ret1 = ret1.concat("\t\t" + element.instructors[0].instructor);
            } else {
              ret1 = ret1.concat("\t\t\t\tStaff");
            }

            ret1 = ret1.concat("\n");
          }
        });

      } //end if

      await client.channels.cache.get(itchid).send("```" + ret1 + "```");
    }); //end request

 
    if (sec_class !== "") {
      var ret2 = "";
      require("request")({
        url: 'https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/courses/' + subject,
        json: true
      }, async function (error, response, body) {
  
        if (!error && response.statusCode === 200) {
          //console.log(body); //Print the json response
          const stuffs = JSON.parse(JSON.stringify(body));
          //console.log(stuffs.courses[0].title)
          //ret += stuffs.courses[0];
          stuffs.courses.forEach(element => {
            if (element.catalog_number === sec_class) {
              ret2 = ret2.concat(element.subject + " " + element.catalog_number + " " + element.title + "\n\n" + element.description + "\n\n" + element.subject + " " + element.catalog_number + " " + element.title);
              let currentDate = new Date();
  
              ret2 = ret2.concat(" - FALL 2022 - As of ");
              if (String(currentDate.getHours()).length === 1) {
                ret2 = ret2.concat("0" + currentDate.getHours() + ":");
              } else {
                ret2 = ret2.concat(currentDate.getHours() + ":");
              }
  
              if (String(currentDate.getMinutes()).length === 1) {
                ret2 = ret2.concat("0" + currentDate.getMinutes() + ":");
              } else {
                ret2 = ret2.concat(currentDate.getMinutes() + ":");
              }
  
              if (String(currentDate.getSeconds()).length === 1) {
                ret2 = ret2.concat("0" + currentDate.getSeconds() + ":");
              } else {
                ret2 = ret2.concat(currentDate.getSeconds());
              }
  
              ret2 = ret2.concat("\n");
            }
          });
  
  
        }
      }); //end request
  
      require("request")({
        url: 'https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/classes/' + subject,
        json: true
      }, async function (error, response, body) {
  
        if (!error && response.statusCode === 200) {
          //console.log(body); //Print the json response
          const stuffs = JSON.parse(JSON.stringify(body));
          //console.log(stuffs.courses[0].title)
          //ret += stuffs.courses[0];
          ret2 = ret2.concat("\n\tSection\t\tLocation\t\tDays\t\t  Seats\t\t\t  Time\t\t\t\t\tFaculty\n\t-------\t\t--------\t\t----\t\t  -----\t\t\t  ----\t\t\t\t\t-------\n");
          stuffs.classes.forEach(element => {
            if (element.catalog_number === sec_class && element.meetings.length > 0) {
              ret2 = ret2.concat("\t " + element.class_number);
              //console.log(element.meetings[0].location);
              if (element.meetings[0].location.length === 5) {
                ret2 = ret2.concat("\t\t   " + element.meetings[0].location);
              } else {
                ret2 = ret2.concat("\t\t  " + element.meetings[0].location);
              }
  
              if (element.meetings[0].days.length === 1) {
                ret2 = ret2.concat("\t\t   " + element.meetings[0].days);
              } else if (element.meetings[0].days.length === 2 || element.meetings[0].days.length === 3) {
                ret2 = ret2.concat("\t\t  " + element.meetings[0].days);
              } else {
                ret2 = ret2.concat("\t\t " + element.meetings[0].days);
              }
  
  
  
              ret2 = ret2.concat("\t\t\t " + (element.enrollment_cap - element.enrollment_cap) + "\t\t\t");
              ret2 = ret2.concat(element.meetings[0].start_time.substring(0, 2) + ":" + element.meetings[0].start_time.substring(2, 4));
              ret2 = ret2.concat(" - ");
              ret2 = ret2.concat(element.meetings[0].end_time.substring(0, 2) + ":" + element.meetings[0].end_time.substring(2, 4));
  
              if (element.instructors.length > 0) {
                ret2 = ret2.concat("\t\t" + element.instructors[0].instructor);
              } else {
                ret2 = ret2.concat("\t\t\t\tStaff");
              }
  
              ret2 = ret2.concat("\n");
            }
          });
  
        } //end if
     
        //await interaction.channel.send("```" + ret2 + "```");
        await client.channels.cache.get(itchid).send("```" + ret2 + "```");
      }); //end request
    }
    
    if (thi_class !== "") {
      var ret3 = "";
      require("request")({
        url: 'https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/courses/' + subject,
        json: true
      }, async function (error, response, body) {
  
        if (!error && response.statusCode === 200) {
          //console.log(body); //Print the json response
          const stuffs = JSON.parse(JSON.stringify(body));
          //console.log(stuffs.courses[0].title)
          //ret += stuffs.courses[0];
          stuffs.courses.forEach(element => {
            if (element.catalog_number === thi_class) {
              ret3 = ret3.concat(element.subject + " " + element.catalog_number + " " + element.title + "\n\n" + element.description + "\n\n" + element.subject + " " + element.catalog_number + " " + element.title);
              let currentDate = new Date();
  
              ret3 = ret3.concat(" - FALL 2022 - As of ");
              if (String(currentDate.getHours()).length === 1) {
                ret3 = ret3.concat("0" + currentDate.getHours() + ":");
              } else {
                ret3 = ret3.concat(currentDate.getHours() + ":");
              }
  
              if (String(currentDate.getMinutes()).length === 1) {
                ret3 = ret3.concat("0" + currentDate.getMinutes() + ":");
              } else {
                ret3 = ret3.concat(currentDate.getMinutes() + ":");
              }
  
              if (String(currentDate.getSeconds()).length === 1) {
                ret3 = ret3.concat("0" + currentDate.getSeconds());
              } else {
                ret3 = ret3.concat(currentDate.getSeconds());
              }
  
              ret3 = ret3.concat("\n");
            }
          });
  
  
        }
      }); //end request
  
      require("request")({
        url: 'https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/classes/' + subject,
        json: true
      }, async function (error, response, body) {
  
        if (!error && response.statusCode === 200) {
          //console.log(body); //Print the json response
          const stuffs = JSON.parse(JSON.stringify(body));
          //console.log(stuffs.courses[0].title)
          //ret += stuffs.courses[0];
          ret3 = ret3.concat("\n\tSection\t\tLocation\t\tDays\t\t  Seats\t\t\t  Time\t\t\t\t\tFaculty\n\t-------\t\t--------\t\t----\t\t  -----\t\t\t  ----\t\t\t\t\t-------\n");
          stuffs.classes.forEach(element => {
            if (element.catalog_number === sec_class && element.meetings.length > 0) {
              ret3 = ret3.concat("\t " + element.class_number);
              //console.log(element.meetings[0].location);
              if (element.meetings[0].location.length === 5) {
                ret3 = ret3.concat("\t\t   " + element.meetings[0].location);
              } else {
                ret3 = ret3.concat("\t\t  " + element.meetings[0].location);
              }
  
              if (element.meetings[0].days.length === 1) {
                ret3 = ret3.concat("\t\t   " + element.meetings[0].days);
              } else if (element.meetings[0].days.length === 2 || element.meetings[0].days.length === 3) {
                ret3 = ret3.concat("\t\t  " + element.meetings[0].days);
              } else {
                ret3 = ret3.concat("\t\t " + element.meetings[0].days);
              }
  
  
  
              ret3 = ret3.concat("\t\t\t " + (element.enrollment_cap - element.enrollment_cap) + "\t\t\t");
              ret3 = ret3.concat(element.meetings[0].start_time.substring(0, 2) + ":" + element.meetings[0].start_time.substring(2, 4));
              ret3 = ret3.concat(" - ");
              ret3 = ret3.concat(element.meetings[0].end_time.substring(0, 2) + ":" + element.meetings[0].end_time.substring(2, 4));
  
              if (element.instructors.length > 0) {
                ret3 = ret3.concat("\t\t" + element.instructors[0].instructor);
              } else {
                ret3 = ret3.concat("\t\t\t\tStaff");
              }
  
              ret3 = ret3.concat("\n");
            }
          });
  
        } //end if
     
        //await interaction.channel.send("```" + ret3 + "```");
        await client.channels.cache.get(itchid).send("```" + ret3 + "```");
      }); //end request
    }
    
      await interaction.reply("Gimme a sec")

  } else if (commandName === 'help') {
    let ret = "```\"/class\" for 1 or more classes \n\nSource Code: \
    \nhttps://github.com/kyeou/Python-Scripts/tree/main/csun_catalog_and_schedules_bot```";
    await interaction.reply(ret);
  }

});

client.login(process.env.DISCORD_TOKEN);