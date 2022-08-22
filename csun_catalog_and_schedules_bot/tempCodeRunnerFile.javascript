console.log("bleh");
require("request")({
    url: './storedschedules/COPM_schedule.json',
    json: true
  },  function (error, response, body) {
    //console.log('https://api.metalab.csun.edu/curriculum/api/2.0/terms/' + semester + '-20' + year + '/classes/' + subject);
    if (!error) {
      
        console.log(body);
    

    } //end if

  
  }); //end request