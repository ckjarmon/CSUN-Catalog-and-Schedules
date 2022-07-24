import urllib3
import json
import sys


"""
How to run: 
python show_schedules.py Semester Year SubjectCode
Example:
python show_schedules.py Fall 2022 COMP
"""

url = u"https://api.metalab.csun.edu/curriculum/api/2.0/terms/" + sys.argv[1] + "-" + \
                                                                  sys.argv[2] + "/classes/" + \
                                                                  sys.argv[3].lower()

print("\n Data Link: " + url)

#try to read the data
try:
    u = urllib3.PoolManager().request("GET", url)
    data = u.data
except Exception as e:
    data = {}

#decode into an array
data = json.loads(data)

"""
setup a blank array for all the strings to 
mass print them after all processing is done
"""
blob_list = []

current_class = ""
for course in data["classes"]:
    
    
    if (current_class != course["title"]): # print out sections every class itself (110, 122, 182 etc...)
        # every new name (COMP 100 vs COMP 110) will start new blob
        blob_list.append("\n\n--------------\n")
        current_class = course["title"]
        blob_list.append(course["subject"] + " " + course["catalog_number"] + " " + course["title"])
        blob_list.append("\n\tSection\t\tLocation\tDays\t\tSeats Aval\t\tTime\t\t\t\tFaculty")
        blob_list.append  ("\t-------\t\t--------\t----\t\t----------\t\t----\t\t\t\t-------")
        
        
    if (len(course["meetings"]) > 0): # if a class has no meetings, it should not be on schedule
        section_string = []
        #section_string.append(course['subject'] + ' ' + course['catalog_number'])
        section_string.append("\t" + course["class_number"])
        
        if (len(course["meetings"][0]["location"]) != 7): 
            # (JD1600A is one character longer than all other class location strings, so it messes up tabs)
            section_string.append("\t\t" + course["meetings"][0]["location"])
        else:
            section_string.append("\t       " + course["meetings"][0]["location"])
            
        section_string.append("\t\t" + course["meetings"][0]["days"])
        section_string.append("\t\t" + str(course["enrollment_cap"] - course["enrollment_count"]))
        section_string.append("\t\t    " +
                              (course["meetings"][0]["start_time"])[0:2] + ":" +
                              (course["meetings"][0]["start_time"])[2:4] 
                              + " - " +
                              (course["meetings"][0]["end_time"])[0:2] + ":" +
                              (course["meetings"][0]["end_time"])[2:4])
        
        if (len(course["instructors"]) > 0): # if a class has no instructor, print Staff instead
            section_string.append("\t\t" + course["instructors"][0]["instructor"])
        else:
            section_string.append("\t\t\t" + "Staff")

        blob_list.append(" ".join(section_string))

print(*blob_list, sep='\n')
