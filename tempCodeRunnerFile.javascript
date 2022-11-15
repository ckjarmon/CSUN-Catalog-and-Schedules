var dict =  
{
    "professor_first_name": "Ani",
    "professor_last_name": "Nahapetian",
    "subject": "COMP",
    "catalog_number": "Comp 310",
    "star_rating": 5,
    "grade": "B",
    "difficulty": 5,
    "retake_professor": "Yes",
    "require_textbooks": "No",
    "mandatory": "Yes",
    "review": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
}



for (n in dict) {console.log(`${n}: ${dict[n]}`)}

fs = require('fs');
fs.writeFile('fingies.json', JSON.stringify(dict, null, 4), function (err) {
  if (err) return console.log(err);
  console.log('Hello World > helloworld.txt');
});