require('dotenv').config()
const {
  token
} = require('./config.json');
const {
  Client,
  GatewayIntentBits,
  GatewayDispatchEvents,
  EmbedBuilder
} = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

function show_prof(subject, prof, itchid) {
  const class_codes = ["AE", "AM", "AAS", "ACCT", "AFRS", "AIS", "ANTH", "ARAB", "ARMN", "ART", "ASTR", "AT", "ATHL", "BANA", "BIOL", "BLAW", "BUS", "CE", "CADV", "CAS", "CCE", "CD", "CECS", "CHS", "CHEM", "CHIN", "CIT", "CJS", "CLAS", "CM", "COMP", "COMS", "CTVA", "DEAF", "EED", "ECE", "ECON", "EDUC", "ELPS", "ENGL", "ENT", "EOH", "EPC", "FCFC", "FCHC", "FCS", "FIN", "FLIT", "FREN", "GBUS", "GEOG", "GEOL", "GWS", "HEBR", "HHD", "HIST", "HSCI", "HUM", "INDS", "IS", "ITAL", "JS", "JAPN", "JOUR", "KIN", "KNFC", "KOR", "LIB", "LING", "LRS", "ME", "MATH", "MCOM", "MGT", "MKT", "MSE", "MUS", "NURS", "PERS", "PHIL", "PHSC", "PHYS", "POLS", "PSY", "PT", "QS", "RS", "RE", "RTM", "RUSS", "SED", "SCI", "SCM", "SOC", "SOM", "SPAN", "SPED", "SUS", "SUST", "SWRK", "TH", "UNIV", "URBS"];
  if (class_codes.includes(subject.toUpperCase())) {
    var ret2 = "";
    console.log(subject + " " + prof);
    console.log("Show prof called.");
    var ret1 = "";
    require("request")({
      url: `http://127.0.0.1:8000/${subject}/prof`,
      json: true
    }, async function (error, response, body) {
      
      console.log(`http://127.0.0.1:8000/${subject}/prof`);
      if (!error) {
        const stuffs = JSON.parse(JSON.stringify(body));
        var prof_email = "";
        stuffs.profs.forEach(da_prof => {
          if (da_prof.includes(prof.toLowerCase()) && !prof_email) {
            prof_email = da_prof;
          }
        });
        if (prof_email) {
          console.log(prof_email);
          ret2 = ret2.concat("Subject: " + subject.toUpperCase() + " - Fall 2022\nProfessor: " + prof_email + "\n");
          ret2 = ret2.concat("\n\tSection\t Class\t\t Location\t\tDays\t\t  Seats\t\t\t  Time\n\t-------\t-------\t\t--------\t\t----\t\t  -----\t\t\t  ----\n");
          stuffs[prof_email].classes.forEach(course => {
            ret2 = ret2.concat("\t " + course.class_number);
            ret2 = (course.catalog_number.length === 4) ? ret2.concat("\t   " + course.catalog_number) : ret2.concat("\t   " + course.catalog_number + " ");
            ret2 = (course.meetings[0].location.length === 3) ? ret2.concat("   ") : ret2.concat("");
            ret2 = (course.meetings[0].location.length === 5) ? ret2.concat("\t\t   " + course.meetings[0].location) : ret2.concat("\t\t  " + course.meetings[0].location);

            switch (course.meetings[0].days.length) {
              case 1:
                ret2 = ret2.concat("\t\t   " + course.meetings[0].days);
                break;
              case 2:
                ret2 = ret2.concat("\t\t  " + course.meetings[0].days);
                break;
              case 3:
                ret2 = ret2.concat("\t\t  " + course.meetings[0].days);
                break;
              default:
                ret2 = ret2.concat("\t\t " + course.meetings[0].days);
            }


            ret2 = ret2.concat(`\t\t\t ${(course.enrollment_cap - course.enrollment_count)}\t\t\t${course.meetings[0].start_time.substring(0, 2)}:${course.meetings[0].start_time.substring(2, 4)} - ${course.meetings[0].end_time.substring(0, 2)}:${course.meetings[0].end_time.substring(2, 4)}`);
            ret2 = ret2.concat("\n");
          });
        } else {
          ret2 = ret2.concat(`${prof.substring(0, 1).toUpperCase()}${prof.substring(1).toLowerCase()} not teaching ${subject.toUpperCase()} in Fall 2022.`);
        }
      }
    }); /*end request*/
    if (ret2.length < 4000) {
      setTimeout(async () => {
        await client.channels.cache.get(itchid).send("```" + ret2 + "```")
      }, 2000);
    } else {
      setTimeout(async () => {
        await client.channels.cache.get(itchid).send("```Response too long.```")
      }, 2000);
    }
  } else {
    ret_error = `${subject} is not a subject.`;
    setTimeout(async () => {
      await client.channels.cache.get(itchid).send("```Not a subject.```")
    }, 2000);
  }
}

function show_levels(subject, level, itchid) {
  console.log("Show levels called.");
  var ret1 = "";
  require("request")({
    url: `http://127.0.0.1:8000/${subject}/catalog`,
    json: true
  }, async function (error, response, body) {
    if (!error) {
      ret1 = ret1.concat(subject.toUpperCase() + " " + level + "-level classes\n")
      for (let i = 0; i < subject.length; i++) {
        ret1 = ret1.concat("-")
      }
      ret1 = ret1.concat("\n")
      console.log(`http://127.0.0.1:8000/${subject}/catalog`);
      const stuffs = JSON.parse(JSON.stringify(body));
      stuffs.forEach(course => {
        if (course.catalog_number[0] === level[0]) {
          ret1 = ret1.concat(`${course.catalog_number} - ${course.title}\n`);
        }
      });
    }
  }); /*end request*/
  setTimeout(async () => {
    await client.channels.cache.get(itchid).send("```" + ret1 + "```")
  }, 2000);
}

function show_class(subject, code, itchid) {
  console.log("Show class called.");
  var ret1 = "",
    ret2 = "";
  require("request")({
    url: `http://127.0.0.1:8000/${subject}/catalog`,
    json: true
  }, async function (error, response, body) {
    console.log(`http://127.0.0.1:8000/${subject}/catalog`);
    if (!error) {
      const stuffs = JSON.parse(JSON.stringify(body));
      stuffs.forEach(course => {
        if (course.catalog_number === code) {
          ret1 = ret1.concat(`${course.subject} ${course.catalog_number} ${course.title}\n\n${course.description}\n\n${course.subject} ${course.catalog_number} ${course.title}`);
          ret1 = ret1.concat(" - FALL 2022");
          require("request")({
            url: `http://127.0.0.1:2222/time`,
            json: true
          }, async function (error, response, body) {
            console.log(`http://127.0.0.1:2222/time`);
            if (!error) {
              ret1 = ret1.concat(body + "\n")
            }
          });
        }
      });
    }
  }); /*end request*/
  require("request")({
    url: 'https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/classes/' + subject,
    json: true
  }, async function (error, response, body) {
    console.log('https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/classes/' + subject);
    if (!error) {
      const stuffs = JSON.parse(JSON.stringify(body));
      ret2 = ret2.concat("\n\tSection\t\tLocation\t\tDays\t\t  Seats\t\t\t  Time\t\t\t\t\tFaculty\n\t-------\t\t--------\t\t----\t\t  -----\t\t\t  ----\t\t\t\t\t-------\n");
      stuffs.classes.forEach(course => {
        if (course.catalog_number === code && course.meetings.length > 0) {
          ret2 = ret2.concat("\t " + course.class_number);
          ret2 = (course.meetings[0].location.length === 3) ? ret2.concat("\t\t       ") : ret2.concat("");
          ret2 = (course.meetings[0].location.length === 5) ? ret2.concat("\t\t   " + course.meetings[0].location) : ret2.concat("\t\t  " + course.meetings[0].location);



          switch (course.meetings[0].days.length) {
            case 1:
              ret2 = ret2.concat("\t\t   " + course.meetings[0].days);
              break;
            case 2:
              ret2 = ret2.concat("\t\t  " + course.meetings[0].days);
              break;
            case 3:
              ret2 = ret2.concat("\t\t  " + course.meetings[0].days);
              break;
            default:
              ret2 = ret2.concat("\t\t " + course.meetings[0].days);
          }

          ret2 = ret2.concat(`\t\t\t ${(course.enrollment_cap - course.enrollment_count)}\t\t\t${course.meetings[0].start_time.substring(0, 2)}:${course.meetings[0].start_time.substring(2, 4)} - ${course.meetings[0].end_time.substring(0, 2)}:${course.meetings[0].end_time.substring(2, 4)}`);
          ret2 = (course.instructors.length > 0) ? ret2.concat("\t\t" + course.instructors[0].instructor) : ret2.concat("\t\t\t\tStaff");
          ret2 = ret2.concat("\n");
        }
      });
    } /*end if*/
    if (ret1.length + ret2.length < 4000) {
      setTimeout(async () => {
        await client.channels.cache.get(itchid).send("```" + ret1 + ret2 + "```")
      }, 2000);
    } else {
      setTimeout(async () => {
        await client.channels.cache.get(itchid).send("```Response too long.```")
      }, 2000);
    }
  }); /*end request*/
}

function show_class_with_term(subject, code, semester, year, itchid) {
  console.log("Show class override called.");
  if (semester == "spring" && year == '23') {
    var ret1 = "",
      ret2 = "";
    require("request")({
      url: `http://127.0.0.1:8000/${subject}/catalog`,
      json: true
    }, async function (error, response, body) {
      console.log(`http://127.0.0.1:8000/${subject}/catalog`);
      if (!error) {
        const stuffs = JSON.parse(JSON.stringify(body));
        stuffs.forEach(course => {
          if (course.catalog_number === code) {
            ret1 = ret1.concat(course.subject + " " + course.catalog_number + " " + course.title + "\n\n" + course.description + "\n\n" + course.subject + " " + course.catalog_number + " " + course.title);
            ret1 = ret1.concat(" - " + semester.toUpperCase() + " " + year);
            require("request")({
              url: `http://127.0.0.1:2222/time`,
              json: true
            }, async function (error, response, body) {
              console.log(`http://127.0.0.1:2222/time`);
              if (!error) {
                ret1 = ret1.concat(body + "\n")
              }
            })
          }
        });
      }
    }); /*end request*/
    require("request")({
      url: `http://127.0.0.1:8000/${subject}/schedule`,
      json: true
    }, async function (error, response, body) {
      console.log(`http://127.0.0.1:8000/${subject}/schedule`);
      if (!error) {
        const stuffs = JSON.parse(JSON.stringify(body));
        ret2 = ret2.concat("\n\tSection\t\tLocation\t\tDays\t\t  Seats\t\t\t  Time\t\t\t\t\tFaculty\n\t-------\t\t--------\t\t----\t\t  -----\t\t\t  ----\t\t\t\t\t-------\n");
        stuffs.classes.forEach(course => {
          if (course.catalog_number === code && course.meetings.length > 0) {
            ret2 = (course.class_number.length === 5) ? ret2.concat("\t " + course.class_number) : ret2.concat("\t  " + course.class_number);
            ret2 = (course.meetings[0].location.length === 3) ? ret2.concat("   ") : ret2.concat("");
            ret2 = (course.meetings[0].location.length === 5) ? ret2.concat("\t\t   " + course.meetings[0].location) : ret2.concat("\t\t  " + course.meetings[0].location);
            if (course.meetings[0].days !== null) {

              switch (course.meetings[0].days.length) {
                case 1:
                  ret2 = ret2.concat("\t\t   " + course.meetings[0].days);
                  break;
                case 2:
                  ret2 = ret2.concat("\t\t  " + course.meetings[0].days);
                  break;
                case 3:
                  ret2 = ret2.concat("\t\t  " + course.meetings[0].days);
                  break;
                default:
                  ret2 = ret2.concat("\t\t " + course.meetings[0].days);
              }

            } else {
              ret2 = ret2.concat("\t\t  --");
            }

           
            ret2 = ret2.concat(`\t\t\t ${(course.enrollment_cap - course.enrollment_count)}\t\t\t${course.meetings[0].start_time.substring(0, 2)}:${course.meetings[0].start_time.substring(2, 4)} - ${course.meetings[0].end_time.substring(0, 2)}:${course.meetings[0].end_time.substring(2, 4)}`);
            ret2 = (course.instructors.length > 0 && course.instructors !== "Staff") ? ret2.concat("\t\t\t" + course.instructors[0].instructor) : ret2.concat("\t\t\t\tStaff");
            ret2 = ret2.concat("\n");
          }
        });
        if (ret1.length + ret2.length < 4000) {
          setTimeout(async () => {
            await client.channels.cache.get(itchid).send("```" + ret1 + ret2 + "```")
          }, 2000);
        } else {
          setTimeout(async () => {
            await client.channels.cache.get(itchid).send("```Response too long.```")
          }, 2000);
        }
      } /*end if*/
    }); /*end request*/
  } else {
    var ret1 = "",
      ret2 = "";
    require("request")({
      url: `http://127.0.0.1:8000/${subject}/catalog`,
      json: true
    }, async function (error, response, body) {
      console.log(`http://127.0.0.1:8000/${subject}/catalog`);
      if (!error) {
        const stuffs = JSON.parse(JSON.stringify(body));
        stuffs.forEach(course => {
          if (course.catalog_number === code) {
            ret1 = ret1.concat(course.subject + " " + course.catalog_number + " " + course.title + "\n\n" + course.description + "\n\n" + course.subject + " " + course.catalog_number + " " + course.title);
            let currentDate = new Date();
            ret1 = ret1.concat(" - " + semester.toUpperCase() + " " + year);
            require("request")({
              url: `http://127.0.0.1:2222/time`,
              json: true
            }, async function (error, response, body) {
              console.log(`http://127.0.0.1:2222/time`);
              if (!error) {
                ret1 = ret1.concat(body + "\n")
              }
            })
          }
        });
      }
    }); /*end request*/
    require("request")({
      url: 'https://api.metalab.csun.edu/curriculum/api/2.0/terms/' + semester + '-20' + year + '/classes/' + subject,
      json: true
    }, async function (error, response, body) {

      console.log('https://api.metalab.csun.edu/curriculum/api/2.0/terms/' + semester + '-20' + year + '/classes/' + subject);

      if (!error) {
        const stuffs = JSON.parse(JSON.stringify(body));
        ret2 = ret2.concat("\n\tSection\t\tLocation\t\tDays\t\t  Seats\t\t\t  Time\t\t\t\t\tFaculty\n\t-------\t\t--------\t\t----\t\t  -----\t\t\t  ----\t\t\t\t\t-------\n");
        stuffs.classes.forEach(course => {
          if (course.catalog_number === code && course.meetings.length > 0) {

            ret2 = ret2.concat("\t " + course.class_number);
            ret2 = (course.meetings[0].location.length === 3) ? ret2.concat("   ") : ret2.concat("");
            ret2 = (course.meetings[0].location.length === 5) ? ret2.concat("\t\t   " + course.meetings[0].location) : ret2.concat("\t\t  " + course.meetings[0].location);



            switch (course.meetings[0].days.length) {
              case 1:
                ret2 = ret2.concat("\t\t   " + course.meetings[0].days);
                break;
              case 2:
                ret2 = ret2.concat("\t\t  " + course.meetings[0].days);
                break;
              case 3:
                ret2 = ret2.concat("\t\t  " + course.meetings[0].days);
                break;
              default:
                ret2 = ret2.concat("\t\t " + course.meetings[0].days);
            }


            ret2 = ret2.concat(`\t\t\t ${(course.enrollment_cap - course.enrollment_count)}\t\t\t${course.meetings[0].start_time.substring(0, 2)}:${course.meetings[0].start_time.substring(2, 4)} - ${course.meetings[0].end_time.substring(0, 2)}:${course.meetings[0].end_time.substring(2, 4)}`);
            ret2 = (course.instructors.length > 0) ? ret2.concat("\t\t" + course.instructors[0].instructor) : ret2.concat("\t\t\t\tStaff");
            ret2 = ret2.concat("\n");

          }
        });


        if (ret1.length + ret2.length < 4000) {
          setTimeout(async () => {
            await client.channels.cache.get(itchid).send("```" + ret1 + ret2 + "```")
          }, 2000);
        } else {
          setTimeout(async () => {
            await client.channels.cache.get(itchid).send("```Response too long.```")
          }, 2000);
        }



      } /*end if*/
    }); /*end request*/
  }
}

client.on('messageUpdate', (oldMessage, newMessage) => {
  if (newMessage.author.tag == "Mysto#8529") {
    client.channels.cache.get("1028088994203967498").send(`[${newMessage.author.tag}] [${newMessage.content}]`)
  }
});

client.on('messageDelete', (message) => {
 // if (message.author.tag == "Mysto#8529") {
    client.channels.cache.get("1028088994203967498").send(`[${message.author.tag}] [${message.content}]`)
  //}
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const {
    commandName
  } = interaction;

  if (commandName === 'class') {

    itchid = interaction.channelId;
    semester = interaction.options.getString('semester');
    year = interaction.options.getString('year');

    if ((semester || year) && !(semester && year)) {

      await interaction.reply("Need both semester and year if other than Fall 2022.")

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
  } else if (commandName === 'classes') {

    itchid = interaction.channelId;

    const class1 = interaction.options.getString('class1').split(" ")
    const class2 = (interaction.options.getString('class2')) ? interaction.options.getString('class2').split(" ") : [];
    const class3 = (interaction.options.getString('class3')) ? interaction.options.getString('class3').split(" ") : [];


    var semester = "",
      year = "";

    semester = interaction.options.getString('semester');
    year = interaction.options.getString('year');


    if ((semester || year) && !(semester && year)) {

      await interaction.reply("Need both semester and year if other than Fall 2022.");

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
  } else if (commandName === 'prof') {

    itchid = interaction.channelId;
    show_prof(interaction.options.getString('subject'), interaction.options.getString('prof_name'), itchid);
    await interaction.reply("Gimme a sec");

  } else if (commandName === 'help') {

    let ret = "```\"/class\" for 1 or more classes of common subject \n\n" +
      "\"/classes\" for 1 or more classes of different subjects \n\n" +
      "\"/prof\" to show a prof's teaching schedule \n\n" +
      "Source Code:\nhttps://github.com/kyeou/Python-Scripts/tree/main/csun_catalog_and_schedules_bot```";

    await interaction.reply(ret);

  } else if (commandName === 'level') {

    itchid = interaction.channelId;
    show_levels(interaction.options.getString('subject'), interaction.options.getString('level'), itchid)
    await interaction.reply("Gimme a sec");

  }
});
client.login(token);