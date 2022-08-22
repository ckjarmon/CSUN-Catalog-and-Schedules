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

function show_class(subject, code, itchid) {
  var ret1 = "";
  require("request")({
    url: 'https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/courses/' + subject,
    json: true
  }, async function (error, response, body) {
    console.log('https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/courses/' + subject);
    if (!error && response.statusCode === 200) {
      //console.log(body); //Print the json response
      const stuffs = JSON.parse(JSON.stringify(body));
      //console.log(stuffs.courses[0].title)
      //ret += stuffs.courses[0];
      stuffs.courses.forEach(element => {
        if (element.catalog_number === code) {
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
            ret1 = ret1.concat("0" + currentDate.getSeconds());
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
    console.log('https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/classes/' + subject);
    if (!error && response.statusCode === 200) {
      //console.log(body); //Print the json response
      const stuffs = JSON.parse(JSON.stringify(body));
      //console.log(stuffs.courses[0].title)
      //ret += stuffs.courses[0];
      ret1 = ret1.concat("\n\tSection\t\tLocation\t\tDays\t\t  Seats\t\t\t  Time\t\t\t\t\tFaculty\n\t-------\t\t--------\t\t----\t\t  -----\t\t\t  ----\t\t\t\t\t-------\n");
      stuffs.classes.forEach(element => {
        if (element.catalog_number === code && element.meetings.length > 0) {
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

}

function show_class(subject, code, semester, year, itchid) {

  if (semester !== "spring" && year !== 23) {
    var ret1 = "";
    require("request")({
      url: 'https://api.metalab.csun.edu/curriculum/api/2.0/terms/' + semester + '-20' + year + '/courses/' + subject,
      json: true
    }, async function (error, response, body) {
      console.log('https://api.metalab.csun.edu/curriculum/api/2.0/terms/' + semester + '-20' + year + '/courses/' + subject);
      if (!error && response.statusCode === 200) {
        //console.log(body); //Print the json response
        const stuffs = JSON.parse(JSON.stringify(body));
        //console.log(stuffs.courses[0].title)
        //ret += stuffs.courses[0];
        stuffs.courses.forEach(element => {
          if (element.catalog_number === code) {
            ret1 = ret1.concat(element.subject + " " + element.catalog_number + " " + element.title + "\n\n" + element.description + "\n\n" + element.subject + " " + element.catalog_number + " " + element.title);
            let currentDate = new Date();

            ret1 = ret1.concat(" - " + semester.toUpperCase() + " " + year + " - As of ");
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
              ret1 = ret1.concat("0" + currentDate.getSeconds());
            } else {
              ret1 = ret1.concat(currentDate.getSeconds());
            }

            ret1 = ret1.concat("\n");
          }
        });


      }
    }); //end request

    require("request")({
      url: 'https://api.metalab.csun.edu/curriculum/api/2.0/terms/' + semester + '-20' + year + '/classes/' + subject,
      json: true
    }, async function (error, response, body) {
      console.log('https://api.metalab.csun.edu/curriculum/api/2.0/terms/' + semester + '-20' + year + '/classes/' + subject);
      if (!error && response.statusCode === 200) {
        //console.log(body); //Print the json response
        const stuffs = JSON.parse(JSON.stringify(body));
        //console.log(stuffs.courses[0].title)
        //ret += stuffs.courses[0];
        ret1 = ret1.concat("\n\tSection\t\tLocation\t\tDays\t\t  Seats\t\t\t  Time\t\t\t\t\tFaculty\n\t-------\t\t--------\t\t----\t\t  -----\t\t\t  ----\t\t\t\t\t-------\n");
        stuffs.classes.forEach(element => {
          if (element.catalog_number === code && element.meetings.length > 0) {
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
  } else {
    var ret1 = "",
      ret2 = "";

    require("request")({
      url: 'https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/courses/' + subject,
      json: true
    }, async function (error, response, body) {
      //console.log('https://api.metalab.csun.edu/curriculum/api/2.0/terms/' + semester + '-20' + year + '/courses/' + subject);
      if (!error && response.statusCode === 200) {
        //console.log(body); //Print the json response
        const stuffs = JSON.parse(JSON.stringify(body));
        //console.log(stuffs.courses[0].title)
        //ret += stuffs.courses[0];
        stuffs.courses.forEach(element => {
          if (element.catalog_number === code) {
            ret1 = ret1.concat(element.subject + " " + element.catalog_number + " " + element.title + "\n\n" + element.description + "\n\n" + element.subject + " " + element.catalog_number + " " + element.title);
            let currentDate = new Date();

            ret1 = ret1.concat(" - " + semester.toUpperCase() + " " + year + " - As of ");
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
              ret1 = ret1.concat("0" + currentDate.getSeconds());
            } else {
              ret1 = ret1.concat(currentDate.getSeconds());
            }

            ret1 = ret1.concat("\n");
          }
        });

        await client.channels.cache.get(itchid).send("```" + ret1 + ret2 + "```");
      }
    }); //end request

    require("request")({
      url: 'http://127.0.0.1:5000/' + subject,
      json: true
    }, async function (error, response, body) {
      //console.log('https://api.metalab.csun.edu/curriculum/api/2.0/terms/' + semester + '-20' + year + '/classes/' + subject);
      if (!error && response.statusCode === 200) {
        //console.log(body); //Print the json response
        const stuffs = JSON.parse(JSON.stringify(body));
        //console.log(stuffs.courses[0].title)
        //ret += stuffs.courses[0];
        ret2 = ret2.concat("\n\tSection\t\tLocation\t\tDays\t\t  Seats\t\t\t  Time\t\t\t\t\tFaculty\n\t-------\t\t--------\t\t----\t\t  -----\t\t\t  ----\t\t\t\t\t-------\n");
        stuffs.classes.forEach(element => {
          if (element.catalog_number === code && element.meetings.length > 0) {
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


    }); //end request

    //await client.channels.cache.get(itchid).send("```Use !csun " + subject +  " " + code + " spring 23```");


  }
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const {
    commandName
  } = interaction;

  if (commandName === 'class') {
    //interaction.deferReply();

    itchid = interaction.channelId;
    //await interaction.reply(interaction.options.getString('subject').toUpperCase() + " " +  interaction.options.getString('catalog_number'));
    //https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/courses/comp

    sem_bool = interaction.options.getString('semester');
    year_bool = interaction.options.getString('year');

    if ((sem_bool || year_bool) && !(sem_bool && year_bool)) {
      await interaction.reply("Need both semester and year if other than Fall 2022.")
    } else if (sem_bool && year_bool) {

      var subject = "",
        fir_class = "",
        sec_class = "",
        thi_class = "",
        semester = "",
        year = "";
      subject = interaction.options.getString('subject').toLowerCase();

      fir_class = interaction.options.getString('catalog_number');

      if (interaction.options.getString('catalog_number1')) {
        sec_class = interaction.options.getString('catalog_number1');
      }

      if (interaction.options.getString('catalog_number2')) {
        thi_class = interaction.options.getString('catalog_number2');
      }

      semester = interaction.options.getString('semester');
      year = interaction.options.getString('year');




      show_class(subject, fir_class, semester, year, itchid);


      if (sec_class !== "") {

        show_class(subject, sec_class, semester, year, itchid);
      }

      if (thi_class !== "") {

        show_class(subject, thi_class, semester, year, itchid);
      }



      await interaction.reply("Gimme a sec")

    } else {
      var subject = "",
        fir_class = "",
        sec_class = "",
        thi_class = "";
      subject = interaction.options.getString('subject').toLowerCase();

      fir_class = interaction.options.getString('catalog_number');

      if (interaction.options.getString('catalog_number1')) {
        sec_class = interaction.options.getString('catalog_number1');
      }

      if (interaction.options.getString('catalog_number2')) {
        thi_class = interaction.options.getString('catalog_number2');
      }




      show_class(subject, fir_class, itchid);


      if (sec_class !== "") {

        show_class(subject, sec_class, itchid);
      }

      if (thi_class !== "") {

        show_class(subject, thi_class, itchid);
      }



      await interaction.reply("Gimme a sec")
    }

  } else if (commandName === 'classes') {
    itchid = interaction.channelId;
    const class1 = interaction.options.getString('class1').split(" ")
    const class2 = (interaction.options.getString('class2')) ? interaction.options.getString('class2').split(" ") : [];
    const class3 = (interaction.options.getString('class3')) ? interaction.options.getString('class3').split(" ") : [];

    sem_bool = interaction.options.getString('semester');
    year_bool = interaction.options.getString('year');

    var semester = "",
      year = "";

    if ((sem_bool || year_bool) && !(sem_bool && year_bool)) {
      await interaction.reply("Need both semester and year if other than Fall 2022.")
    } else if (sem_bool && year_bool) {

      semester = interaction.options.getString('semester');
      year = interaction.options.getString('year');


      show_class(class1[0], class1[1], semester, year, itchid);

      if (class2.length !== 0) {
        show_class(class2[0], class2[1], semester, year, itchid);
      }

      if (class3.length !== 0) {
        show_class(class3[0], class3[1], semester, year, itchid);
      }
    } else {

      show_class(class1[0], class1[1], itchid);

      if (class2.length !== 0) {
        show_class(class2[0], class2[1], itchid);
      }

      if (class3.length !== 0) {
        show_class(class3[0], class3[1], itchid);
      }
      await interaction.reply("Gimme a sec");
    }
  } else if (commandName === 'help') {

    let ret = "```\"/class\" for 1 or more classes \n\nSource Code: \
    \nhttps://github.com/kyeou/Python-Scripts/tree/main/csun_catalog_and_schedules_bot```";
    await interaction.reply(ret);

  }

});

client.login(process.env.DISCORD_TOKEN);