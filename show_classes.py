import urllib3
import json
import sys

"""
How to run, for all classes:
python show_classes.py SubjectCode
Example:
python show_classes.py comp

How to run, for one class: 
python show_schedules.py SubjectCode CatalogNumber
Example:
python show_schedules.py COMP 182
"""


if len(sys.argv) > 2:
    current_class = sys.argv[2]
else:
    current_class = ""


url = u"https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/courses/" + sys.argv[1]
#print("\n Data Link: " + url)


#try to read the data
try:
    data = urllib3.PoolManager().request("GET", url).data
except Exception as e:
    data = {}
#decode into an array
data = json.loads(data)
tuples = []
json_blobs = []

if current_class == "":
    for course in data["courses"]:
        if (current_class != course["catalog_number"]):
            current_class = course["title"]
            tuples.append([course["subject"] + " " + course["catalog_number"] + " " +  course["title"], course["description"]])
            del course["term"] 
            del course["section_number"]
            del course["course_id"]
            json_blobs.append(course)
else:
    for course in data["courses"]:
        if (current_class == course["catalog_number"]):
            tuples.append([course["subject"] + " " + course["catalog_number"] + " " +  course["title"], course["description"]])
            del course["term"] 
            del course["section_number"]
            del course["course_id"]
            json_blobs.append(course)
            break

    
        
        
        
        
url = u"https://api.metalab.csun.edu/curriculum/api/2.0/terms/Spring-2022/courses/" + sys.argv[1]
#print("\n Data Link: " + url)



#try to read the data
try:
    data = urllib3.PoolManager().request("GET", url).data
except Exception as e:
    data = {}
#decode into an array
data = json.loads(data)



if current_class == "":
    for course in data["courses"]:
        if (current_class != course["catalog_number"]):
            current_class = course["title"]
            tuples.append([course["subject"] + " " + course["catalog_number"] + " " +  course["title"], course["description"]])
            del course["term"] 
            del course["section_number"]
            del course["course_id"]
            json_blobs.append(course)
else:
    for course in data["courses"]:
        if (current_class == course["catalog_number"]):
            tuples.append([course["subject"] + " " + course["catalog_number"] + " " +  course["title"], course["description"]])
            del course["term"] 
            del course["section_number"]
            del course["course_id"]
            json_blobs.append(course)
            break

            
            

#print(*tuples, sep='\n')
#print(*json_blobs, sep="\n")

#file1 = open(a + "_catalog", "w")
#json.dump(json_blobs, file1, indent=4)




for element in json_blobs:
    if element["description"] != None:
        print()
        print(element["subject"] + " " + element["catalog_number"] + " " + element["title"])
        print(element["description"])
        if len(sys.argv) > 2:
            break
