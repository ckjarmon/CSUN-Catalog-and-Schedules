import os
import urllib3
import json
import sys



def show_schedule(sub, code):
    # url = u"https://api.metalab.csun.edu/curriculum/api/2.0/terms/" + sem + "-" + \
    #                                                               year + "/classes/" + \
    #                                                               sub

    #try to read the data
    # try:
    #     data = urllib3.PoolManager().request("GET", url).data
    # except Exception as e:
    #     data = {}
        
    #decode into an array
    data = json.load(open(sub + "_schedule.json"))
        
    def find_class(current_class):
        ret_value = ""
        for course in data["classes"]:
            if (current_class == course["catalog_number"]): 
                ret_value = course["title"]
        return ret_value
            
            
    blob_list = []
    
    blob_list.append(sub.upper() + " " + code + " " + find_class(code) + " - SPRING 2023")
    blob_list.append("\n\tSection\t\tLocation\tDays\t\tSeats Aval\t\t\t  Time\t\t\t\tFaculty")
    blob_list.append  ("\t-------\t\t--------\t----\t\t----------\t\t\t  ----\t\t\t\t-------")
    
    for course in data["classes"]:
        if (len(course["meetings"]) > 0) and code == course["catalog_number"]: # if a class has no meetings, it should not be on schedule
            section_string = []
            #section_string.append(course['subject'] + ' ' + course['catalog_number'])
            section_string.append("\t " + course["class_number"] + " ")

            if (len(course["meetings"][0]["location"]) != 7): 
                # (JD1600A is one character longer than all other class location strings, so it messes up tabs)
                section_string.append("\t\t" + course["meetings"][0]["location"])
            else:
                section_string.append("\t       " + course["meetings"][0]["location"])
              
                
            if len(course["meetings"][0]["days"]) == 1:
                section_string.append("\t  " + course["meetings"][0]["days"])   
                
            elif len(course["meetings"][0]["days"]) == 2:
                section_string.append("\t " + course["meetings"][0]["days"])  
                 
            elif len(course["meetings"][0]["days"]) == 3:
                section_string.append("\t " + course["meetings"][0]["days"])
                
            else:
                section_string.append("\t" + course["meetings"][0]["days"])
                
                
            if len(str(course["enrollment_cap"] - course["enrollment_count"])) == 1:
                section_string.append("\t\t    " + str(course["enrollment_cap"] - course["enrollment_count"]))
            else:
                section_string.append("\t\t   " + str(course["enrollment_cap"] - course["enrollment_count"]))
                
                
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
        
    return "\n".join([str(x) for x in blob_list])


print(show_schedule("AM", "316"))