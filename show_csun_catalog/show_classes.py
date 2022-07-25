import urllib3
import json
import sys

"""
How to run:
python show_classes.py SubjectCode
Example:
python show_classes.py comp
"""

a = sys.argv[1]


url = u"https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/courses/" + a
print("\n Data Link: " + url)


#try to read the data
try:
    u = urllib3.PoolManager().request("GET", url)
    data = u.data
except Exception as e:
    data = {}
#decode into an array
data = json.loads(data)
tuples = []
json_blobs = []
current_class = ""
for course in data["courses"]:
    if (current_class != course["title"]):
        current_class = course["title"]
        tuples.append([course["subject"] + " " + course["catalog_number"] + " " +  course["title"], course["description"]])
        del course["term"] 
        del course["section_number"]
        del course["course_id"]
        json_blobs.append(course)
        
        
        
        
url = u"https://api.metalab.csun.edu/curriculum/api/2.0/terms/Spring-2022/courses/" + a
print("\n Data Link: " + url)



#try to read the data
try:
    u = urllib3.PoolManager().request("GET", url)
    data = u.data
except Exception as e:
    data = {}
#decode into an array
data = json.loads(data)



current_class = ""
for course in data["courses"]:
    if (current_class != course["title"]):
        current_class = course["title"]
        del course["term"] 
        del course["section_number"]
        del course["course_id"]
        if not([course["subject"] + " " + course["catalog_number"] + " " +  course["title"], course["description"]] in tuples):
            tuples.append([course["subject"] + " " + course["catalog_number"] + " " +  course["title"], course["description"]])
            json_blobs.append(course)
            
            

#print(*tuples, sep='\n')
#print(*json_blobs, sep="\n")

#file1 = open(a + "_catalog", "w")
#json.dump(json_blobs, file1, indent=4)




for element in json_blobs:
    if element["description"] != None:
        print("\n-------------------------------------------\n")
        print(element["subject"] + " " + element["catalog_number"] + " " + element["title"])
        print(element["description"])
