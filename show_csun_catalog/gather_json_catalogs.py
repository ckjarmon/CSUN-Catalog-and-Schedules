import urllib3
import json
import sys

class_codes = ["AE","AM","AAS","ACCT","AFRS","AIS","ANTH","ARAB","ARMN","ART","ASTR","AT","ATHL","BANA","BIOL","BLAW","BUS","CE","CADV","CAS","CCE","CD","CECS","CHS","CHEM","CHIN","CIT","CJS","CLAS","CM","COMP","COMS","CTVA","DEAF","EED","ECE","ECON","EDUC","ELPS","ENGL","ENT","EOH","EPC","FCFC","FCHC","FCS","FIN","FLIT","FREN","GBUS","GEOG","GEOL","GWS","HEBR","HHD","HIST","HSCI","HUM","INDS","IS","ITAL","JS","JAPN","JOUR","KIN","KNFC","KOR","LIB","LING","LRS","ME","MATH","MCOM","MGT","MKT","MSE","MUS","NURS","PERS","PHIL","PHSC","PHYS","POLS","PSY","PT","QS","RS","RE","RTM","RUSS","SED","SCI","SCM","SOC","SOM","SPAN","SPED","SUS","SUST","SWRK","TH","UNIV","URBS"]

for a in class_codes:


    url = u"https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/classes/" + a



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
    for course in data["classes"]:
        if (current_class != course["title"]):
            current_class = course["title"]
            tuples.append([course["subject"] + " " + course["catalog_number"] + " " +  course["title"], course["description"]])
            del course["term"]
            del course["class_number"]
            del course["section_number"]
            del course["course_id"]
            del course["enrollment_cap"]
            del course["enrollment_count"]
            del course["waitlist_cap"]
            del course["waitlist_count"]
            del course["meetings"]
            del course["instructors"]
            json_blobs.append(course)


    url = u"https://api.metalab.csun.edu/curriculum/api/2.0/terms/Spring-2022/classes/" + a


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
    for course in data["classes"]:
        if (current_class != course["title"]):
            current_class = course["title"]
            del course["term"]
            del course["class_number"]
            del course["section_number"]
            del course["course_id"]
            del course["enrollment_cap"]
            del course["enrollment_count"]
            del course["waitlist_cap"]
            del course["waitlist_count"]
            del course["meetings"]
            del course["instructors"]
            if not([course["subject"] + " " + course["catalog_number"] + " " +  course["title"], course["description"]] in tuples):
                tuples.append([course["subject"] + " " + course["catalog_number"] + " " +  course["title"], course["description"]])
                json_blobs.append(course)

    print(*tuples, sep='\n')
    #print(*json_blobs, sep="\n")
    print("\n\n\n\n")
    file1 = open(a + "_catalog", "w")

    json.dump(json_blobs, file1, indent=4)
