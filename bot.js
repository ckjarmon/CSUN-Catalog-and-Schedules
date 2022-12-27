require('dotenv').config()
const {
  token
} = require('./config.json');
const {
  Client,
  GatewayIntentBits,
  GatewayDispatchEvents,
  EmbedBuilder,
  Guild
} = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMembers]
});
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});



function show_prof(subject, itchid, id) {
  var ret1 = "";
 
  // if no id is provided, GET request returns all profs/id combos
  
  /* if id is provided, GET request returns the prof 
  * info and the classes they are teaching
  */
  _url = (id) 
  ? `http://127.0.0.1:2222/profs/${subject}/${id}` 
  : `http://127.0.0.1:2222/profs/${subject}`;


  if (!id) {
    require("request")({
      url: _url,
      json: true
    }, async function (error, response, body) {

      console.log(_url);
      let ret1 = String(body).replaceAll(',', '');
      // console.log(body);
      if (!error) {
        setTimeout(async () => {
          await client.channels.cache.get(itchid).send("```" + ret1 + "```")
        }, 3000);
      }
    });
  } else {
    require("request")({
      url: _url,
      json: true
    }, async function (error, response, body) {

      console.log(_url);

      body.info["Name"] = body.info.first_name + " " + body.info.last_name;

      delete body.info.subject;
      delete body.info.location;
      delete body.info.phone_number;
      delete body.info.first_name;
      delete body.info.last_name;
      delete body.info.image_link;

      for (n in body.info) {
        if (body.info[n] !== "N/A") {
          ret1 += (`${n.substring(0, 1).toUpperCase()}${n.substring(1)}` + ": " + body.info[n] + "\n");
        }
      }

      
      ret1 += ("\n\tSPRING 2023\n\t-----------\n");
      require("request")({
        url: `http://127.0.0.1:2222/time`,
        json: true
      }, function (error, response, body) {
        console.log(`http://127.0.0.1:2222/time`);
        if (!error) {
          ret1 += ("\n" + body + "\n");
        }
      });
      ret1 += ("\n\tSection\tSubject\t Class\t\t Location\t\tDays\t\t  Seats\t\t\t  Time")
      ret1 += ("\n\t-------\t-------\t-------\t\t--------\t\t----\t\t  -----\t\t\t  ----\n");
      body.sch.forEach(course => {

        ret1 += ("\t " + course.class_number);

        ret1 += (course.subject.length === 4) 
        ? ("\t   " + course.subject) 
        : ("\t   " + course.subject + " ");

        ret1 += (course.catalog_number.length === 4) 
        ? ("\t   " + course.catalog_number) 
        : ("\t   " + course.catalog_number + " ");

        ret1 += (course.location.length === 3) 
        ? ("   ") 
        : ("");


        ret1 += (course.location.length === 5) 
        ? ("\t\t   " + course.location) 
        : ("\t\t  " + course.location);


        if (course.days !== "None") {
          switch (course.days.length) {
            case 1:
              ret1 += ("\t\t   " + course.days);
              break;
            case 2:
              ret1 += ("\t\t  " + course.days);
              break;
            case 3:
              ret1 += ("\t\t  " + course.days);
              break;
            default:
              ret1 += ("\t\t " + course.days);
          }
        } else {
          ret1 += ("\t\t  --");
        }


        ret1 += ((`${(course.enrollment_cap - course.enrollment_count)}`).length < 10) 
        ? (`\t\t\t${(course.enrollment_cap - course.enrollment_count)}\t\t\t`)
        : (`\t\t\t ${(course.enrollment_cap - course.enrollment_count)}\t\t\t`);

        ret1 += (`${course.start_time.substring(0, 2)}:${course.start_time.substring(2, 4)}`);
        ret1 += (" - ");
        ret1 += (`${course.end_time.substring(0, 2)}:${course.end_time.substring(2, 4)}`);
        ret1 += ("\n");
      });






      if (!error) {
        setTimeout(async () => {
          await client.channels.cache.get(itchid).send("```" + ret1 + "```");
        }, 3000);
      }
    });
  }

}


// simply returns all classes at a specified level
function show_levels(subject, level, itchid) {
  console.log("Show levels called.");
  var ret1 = "";
  require("request")({
    url: `http://127.0.0.1:2222/${subject}/catalog`,
    json: true
  }, async function (error, response, body) {
    if (!error) {

      ret1 += (subject.toUpperCase() + " " + level + "-level classes\n")

      for (let i = 0; i < subject.length; i++) {
        ret1 += ("-")
      }

      ret1 += ("\n")

      console.log(`http://127.0.0.1:2222/${subject}/catalog`);

      const stuffs = JSON.parse(JSON.stringify(body));
      stuffs.forEach(course => {
        if (course.catalog_number[0] === level[0]) {
          ret1 += (`${course.catalog_number} - ${course.title}\n`);
        }
      });
    }

  }); /*end request*/
  setTimeout(async () => {
    await client.channels.cache.get(itchid).send("```" + ret1 + "```")
  }, 2000);
}

// for every semester after Fall 2022
function show_class(subject, code, itchid) {


  console.log("Show class called.");
  var ret1 = "",
    ret2 = "";
  require("request")({
    url: `http://127.0.0.1:2222/${subject}/catalog`,
    json: true
  }, async function (error, response, body) {
    console.log(`http://127.0.0.1:2222/${subject}/catalog`);
    if (!error) {
      const stuffs = JSON.parse(JSON.stringify(body));

      stuffs.forEach(course => {

        if (course.catalog_number === code) {
          ret1 += (`${course.subject} ${course.catalog_number} ${course.title}`);
          ret1 += (`\n\n${course.description}\n\n${course.subject} ${course.catalog_number} ${course.title}`);
          ret1 += (" - SPRING 2023");

          require("request")({
            url: `http://127.0.0.1:2222/time`,
            json: true
          }, function (error, response, body) {
            console.log(`http://127.0.0.1:2222/time`);
            if (!error) {
              ret1 += (body + "\n");
            }
          });
        }
      });
    }
  }); /*end request*/
  require("request")({
    url: `http://127.0.0.1:2222/${subject}/schedule`,
    json: true
  }, async function (error, response, body) {
    console.log(`http://127.0.0.1:2222/${subject}/schedule`);
    if (!error) {

      const stuffs = JSON.parse(JSON.stringify(body));

      ret2 += ("\n\tSection\t\tLocation\t\tDays\t\t  Seats\t\t Waitlist Queue\t\t\t  Time\t\t\t\t\tFaculty");
      ret2 += ("\n\t-------\t\t--------\t\t----\t\t  -----\t\t --------------\t\t\t  ----\t\t\t\t\t-------\n");

      for (const key in stuffs[`${String(subject).toUpperCase()} ${code}`]) {
        course = stuffs[`${String(subject).toUpperCase()} ${code}`][key];

        console.log(course);

        ret2 += ("\t " + course.class_number);

        if (course.location.length === 5) {
          ret2 += (`\t\t   ${course.location}`);
        } else if (course.location.length > 5) {
          ret2 += (`\t\t  ${course.location}`);
        } else {
          ret2 += (`\t\t     ${course.location}`);
        }

        if (course.days !== null) {
          switch (course.days.length) {
            case 1:
              ret2 += ("\t\t   " + course.days);
              break;
            case 2:
              ret2 += ("\t\t  " + course.days);
              break;
            case 3:
              ret2 += ("\t\t  " + course.days);
              break;
            default:
              ret2 += ("\t\t " + course.days);
          }
        } else {
          ret2 += ("\t\t  --");
        }


        ret1 += ((`${(course.enrollment_cap - course.enrollment_count)}`).length < 10) 
        ? (`\t\t\t${(course.enrollment_cap - course.enrollment_count)}\t\t\t`)
        : (`\t\t\t ${(course.enrollment_cap - course.enrollment_count)}\t\t\t`);
        

        if (course.waitlist_cap > 0) {

          if (course.waitlist_count > 10) { ret2 += (`\t\t\t     ${(course.waitlist_count)}\t`); } 
          else                            { ret2 += (`\t\t\t      ${(course.waitlist_count)}\t`); }

        }
        else { ret2 += (`\t\t\t    N/A   `); }

        ret2 += (`\t\t\t${course.start_time.substring(0, 2)}:${course.start_time.substring(2, 4)}`);
        ret2 += (" - ");
        ret2 += (`${course.end_time.substring(0, 2)}:${course.end_time.substring(2, 4)}`);
        
        ret2 += (course.instructor !== "Staff") 
        ? ("\t\t" + course.instructor) 
        : ("\t\t\t\tStaff");

        ret2 += ("\n");
      }

    } /*end if*/
   
      setTimeout(async () => {
        await client.channels.cache.get(itchid).send("```" + (ret1 + ret2).substring(0, 1993) + "```");
        await client.channels.cache.get(itchid).send("```" + (ret1 + ret2).substring(1994) + "```");
      }, 2000);
   
  }); /*end request*/
}

// for every class before spring 2023
function show_class_with_term(subject, code, semester, year, itchid) {
  console.log("Show class override called.");
 
    var ret1 = "",
      ret2 = "";
    require("request")({
      url: `http://127.0.0.1:2222/${subject}/catalog`,
      json: true
    }, async function (error, response, body) {
      console.log(`http://127.0.0.1:2222/${subject}/catalog`);
      if (!error) {
        const stuffs = JSON.parse(JSON.stringify(body));
        stuffs.forEach(course => {
          if (course.catalog_number === code) {
            ret1 += (course.subject + " " + course.catalog_number + " " + course.title + "\n\n" + course.description);
            ret1 += ("\n\n" + course.subject + " " + course.catalog_number + " " + course.title);

            ret1 += (" - " + semester.toUpperCase() + " " + year);
            require("request")({
              url: `http://127.0.0.1:2222/time`,
              json: true
            }, async function (error, response, body) {
              console.log(`http://127.0.0.1:2222/time`);
              if (!error) {
                ret1 += (body + "\n");
              }
            })
          }
        });
      }
    }); /*end request*/
    require("request")({
      url: `https://api.metalab.csun.edu/curriculum/api/2.0/terms/${semester}-20${year}/classes/${subject}`,
      json: true
    }, async function (error, response, body) {

      console.log(`https://api.metalab.csun.edu/curriculum/api/2.0/terms/${semester}-20${year}/classes/${subject}`);

      if (!error) {
        const stuffs = JSON.parse(JSON.stringify(body));
        ret2 += ("\n\tSection\t\tLocation\t\tDays\t\t  Seats\t\t\t  Time\t\t\t\t\tFaculty");
        ret2 += ("\n\t-------\t\t--------\t\t----\t\t  -----\t\t\t  ----\t\t\t\t\t-------\n");
        stuffs.classes.forEach(course => {
          if (course.catalog_number === code && course.meetings.length > 0) {

            ret2 += ("\t " + course.class_number);

            ret2 += (course.meetings[0].location.length === 3) 
            ? ("   ") 
            : ("");

            ret2 += (course.meetings[0].location.length === 5) 
            ? ("\t\t   " + course.meetings[0].location) 
            : ("\t\t  " + course.meetings[0].location);



            switch (course.meetings[0].days.length) {
              case 1:
                ret2 += ("\t\t   " + course.meetings[0].days);
                break;
              case 2:
                ret2 += ("\t\t  " + course.meetings[0].days);
                break;
              case 3:
                ret2 += ("\t\t  " + course.meetings[0].days);
                break;
              default:
                ret2 += ("\t\t " + course.meetings[0].days);
            }


            ret2 += ((`${(course.enrollment_cap - course.enrollment_count)}`).length < 10) 
            ? (`\t\t\t${(course.enrollment_cap - course.enrollment_count)}\t\t\t`)
            : (`\t\t\t ${(course.enrollment_cap - course.enrollment_count)}\t\t\t`);
            

            ret2 += (`\t\t\t${course.meetings[0].start_time.substring(0, 2)}:${course.meetings[0].start_time.substring(2, 4)}`);
            ret2 += (" - ");
            ret2 += (`${course.meetings[0].end_time.substring(0, 2)}:${course.meetings[0].end_time.substring(2, 4)}`);
            
            ret2 += (course.instructors.length > 0) 
            ? ("\t\t" + course.instructors[0].instructor) 
            : ("\t\t\t\tStaff");
            ret2 += ("\n");

          }
        });


        
          setTimeout(async () => {
            await client.channels.cache.get(itchid).send("```" + (ret1 + ret2).substring(0, 1993) + "```");
            await client.channels.cache.get(itchid).send("```" + (ret1 + ret2).substring(1994) + "```");
          }, 2000);
        } 
    }); /*end request*/
  }


client.on('messageUpdate', (oldMessage, newMessage) => {
  if (newMessage.author.tag == "Mysto#8529") {
    client.channels.cache.get("1028088994203967498").send(`[${newMessage.author.tag}] [${oldMessage.content}] => [${newMessage.content}]`);
  }
});

client.on('messageDelete', (message) => {
  if (message.author.tag == "Mysto#8529") {
    client.channels.cache.get("1028088994203967498").send(`[${message.author.tag}] [${message.content}]`);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const {
    commandName
  } = interaction;



  switch (commandName) {
    case 'class': {

      itchid = interaction.channelId;
      semester = interaction.options.getString('semester');
      year = interaction.options.getString('year');

      if ((semester || year) && !(semester && year)) {

        await interaction.reply("Need both semester and year if other than Spring 2023.");

      } else if (semester && year) {

        var subject = "",
          fir_class = "",
          sec_class = "",
          thi_class = "";

        subject = interaction.options.getString('subject').toLowerCase();
        fir_class = interaction.options.getString('catalog_number');
        sec_class = interaction.options.getString('catalog_number1');
        thi_class = interaction.options.getString('catalog_number2');

        show_class_with_term(subject, fir_class, semester, year, itchid);
        if (sec_class) {
          show_class_with_term(subject, sec_class, semester, year, itchid);
        }
        if (thi_class) {
          show_class_with_term(subject, thi_class, semester, year, itchid);
        }


        await interaction.reply("Gimme a sec");


      } else {


        var subject = "",
          fir_class = "",
          sec_class = "",
          thi_class = "";


        subject = interaction.options.getString('subject').toLowerCase();
        fir_class = interaction.options.getString('catalog_number');
        sec_class = interaction.options.getString('catalog_number1');
        thi_class = interaction.options.getString('catalog_number2');


        show_class(subject, fir_class, itchid);
        if (sec_class) {
          show_class(subject, sec_class, itchid);
        }
        if (thi_class) {
          show_class(subject, thi_class, itchid);
        }

        await interaction.reply("Gimme a sec");
      }
    } break;
    case 'classes': {

      itchid = interaction.channelId;

      const class1 = interaction.options.getString('class1').split(" ")
      const class2 = (interaction.options.getString('class2')) ? interaction.options.getString('class2').split(" ") : [];
      const class3 = (interaction.options.getString('class3')) ? interaction.options.getString('class3').split(" ") : [];


      var semester = "",
        year = "";

      semester = interaction.options.getString('semester');
      year = interaction.options.getString('year');


      if ((semester || year) && !(semester && year)) {

        await interaction.reply("Need both semester and year if other than Spring 2023.");

      } else if (semester && year) {

        show_class_with_term(class1[0], class1[1], semester, year, itchid);
        if (class2.length) {
          show_class_with_term(class2[0], class2[1], semester, year, itchid);
        }
        if (class3.length) {
          show_class_with_term(class3[0], class3[1], semester, year, itchid);
        }

        await interaction.reply("Gimme a sec");

      } else {

        show_class(class1[0], class1[1], itchid);

        if (class2.length) {
          show_class(class2[0], class2[1], itchid);
        }

        if (class3.length) {
          show_class(class3[0], class3[1], itchid);
        }

        await interaction.reply("Gimme a sec");
      }
    } break; case 'prof': {

      itchid = interaction.channelId;
      show_prof(interaction.options.getString('subject'), itchid, interaction.options.getString('prof_id'));
      await interaction.reply("Gimme a sec");

    } break;
    case 'help': {

      let ret = "```\"/class\" for 1 or more classes of common subject (default is SPRING 23) \n\n" +
        "\"/classes\" for 1 or more classes of different subjects \n\n" +
        "\"/prof\" to show a prof's teaching schedule \n\n" +
        "\"/level\" to show classes at a specific level (100, 200, 300 etc.) \n\n" +
        "\"/gunfight\" to time somebody out for 10 secs \n\n" +
        "Source Code:\nhttps://github.com/kyeou/CSUN-Catalog-and-Schedules```";

      await interaction.reply(ret);

    } break;
    case 'level': {

      itchid = interaction.channelId;
      show_levels(interaction.options.getString('subject'), interaction.options.getString('level'), itchid);
      await interaction.reply("Gimme a sec");

    } break;
    case 'gunfight': {

      const user = interaction.options.getUser('target');

      const member = interaction.guild.members.cache.get(user.id);
      if (member.id !== "534510030490304524") { 
        member.timeout(10000, "bleh"); 
        interaction.reply(`\`\`\`${user.username} has been timed out!\`\`\``); }
      else { 
        interaction.reply('```Kyeou is immune.```'); 
      }

    }
  }
});
client.login(token);

