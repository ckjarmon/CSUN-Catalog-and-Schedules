#python
import urllib3
import json
import sys

#query all CompSci courses
#url = u'https://api.metalab.csun.edu/curriculum/api/2.0/courses/comp'
url = u"https://api.metalab.csun.edu/curriculum/api/2.0/terms/" + sys.argv[1] + "-" + sys.argv[2] + "/classes/" + sys.argv[3].lower()

#try to read the data	
try:
   u = urllib3.PoolManager().request("GET", url)
   data = u.data
except Exception as e:
	data = {}


#print(data)
#decode into an array
data = json.loads(data)

#setup a blank array
course_list = []


#loop through results and add each course's subject
#and catalog number to course_list array (i.e COMP 100)
current_class = ""
for course in data['classes']:
    if (current_class != course["title"]):
        course_list.append("\n\n--------------\n")
        current_class = course["title"]
        course_list.append(course['subject'] + ' ' + course['catalog_number'] + ' ' + course["title"])
        course_list.append("")
        course_list.append("\tSection\t\tLocation\tDays\t\tSeats Aval\t\tTime\t\t\t\tFaculty")
        course_list.append("\t-------\t\t--------\t----\t\t----------\t\t----\t\t\t\t-------")
    if (len(course["meetings"]) > 0):
        section_string = []
        #section_string.append(course['subject'] + ' ' + course['catalog_number'])
        section_string.append("\t" + course["class_number"])
        section_string.append("\t\t" + course["meetings"][0]["location"])
        
        section_string.append("\t\t" + course["meetings"][0]["days"])
        section_string.append("\t\t" + str(course["enrollment_cap"] - course["enrollment_count"]))
        section_string.append("\t\t    " + (course["meetings"][0]["start_time"])[0:2] + ":" + (course["meetings"][0]["start_time"])[2:4] + " - " +  (course["meetings"][0]["end_time"])[0:2] + ":" + (course["meetings"][0]["end_time"])[2:4])
        if(len(course["instructors"]) > 0):
            section_string.append("\t\t" + course["instructors"][0]["instructor"])
        else:
            section_string.append("\t\t\t" + "Staff")
        
        course_list.append(" ".join(section_string))
        
    

print(*course_list, sep='\n')
			