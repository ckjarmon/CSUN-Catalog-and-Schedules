console.log("bleh");
require("request")({
    url: '/storedschedules/COMP_schedule.json',
    json: true
  },  function (error, response, body) {
    //console.log('https://api.metalab.csun.edu/curriculum/api/2.0/terms/' + semester + '-20' + year + '/classes/' + subject);
   
      
        console.log(JSON.stringify(body));
    

 

  
  }); //end request