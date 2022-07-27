# bot.py
import os
import urllib3
import json
import sys

import discord
from dotenv import load_dotenv



load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

client = discord.Client()

def show_classes(subject, number):
    url = u"https://api.metalab.csun.edu/curriculum/api/2.0/terms/Fall-2022/courses/" + subject
    #print("\n Data Link: " + url)


    #try to read the data
    try:
        u = urllib3.PoolManager().request("GET", url)
        data = u.data
    except Exception as e:
        data = {}
    #decode into an array
    data = json.loads(data)

    json_blobs = []
    current_class = number
    for course in data["courses"]:
        if (current_class == course["catalog_number"]):
                del course["term"] 
                del course["section_number"]
                del course["course_id"]
                json_blobs.append(course)
                
    url = u"https://api.metalab.csun.edu/curriculum/api/2.0/terms/Spring-2022/courses/" + subject
    #print("\n Data Link: " + url)


    #try to read the data
    try:
        data = urllib3.PoolManager().request("GET", url).data
    except Exception as e:
        data = {}
    #decode into an array
    data = json.loads(data)

    json_blobs = []
    current_class = number
    for course in data["courses"]:
        if (current_class == course["catalog_number"]):
            del course["term"] 
            del course["section_number"]
            del course["course_id"]
            json_blobs.append(course)
            break
    
    if len(json_blobs) > 0:
        return json_blobs[0]["subject"].upper() + " " + json_blobs[0]["catalog_number"] + " " + json_blobs[0]["title"] + "\n\n" + json_blobs[0]["description"]
    


def show_schedule(sem, year, sub, code):
    url = u"https://api.metalab.csun.edu/curriculum/api/2.0/terms/" + sem + "-" + \
                                                                  year + "/classes/" + \
                                                                  sub

    #try to read the data
    try:
        u = urllib3.PoolManager().request("GET", url)
        data = u.data
    except Exception as e:
        data = {}
        
    #decode into an array
    data = json.loads(data)
        
    def find_class(current_class):
        ret_value = ""
        for course in data["classes"]:
            if (current_class == course["catalog_number"]): 
                ret_value = course["title"]
        return ret_value
            
            
    blob_list = []
    
    blob_list.append(sub.upper() + " " + code + " " + find_class(code) + " - "+ sem.upper() + " " + year)
    blob_list.append("\n\tSection\t\tLocation\tDays\t\tSeats Aval\t\tTime\t\t\t\tFaculty")
    blob_list.append  ("\t-------\t\t--------\t----\t\t----------\t\t----\t\t\t\t-------")
    
    for course in data["classes"]:
        if (len(course["meetings"]) > 0) and code == course["catalog_number"]: # if a class has no meetings, it should not be on schedule
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
        #blob_list.append("```")
        
    return "\n".join([str(x) for x in blob_list])



@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')

@client.event
async def on_message(message):
    #if message.author == client.user:
     #   return

    msg_split = message.content.split()
    if message.content.__contains__("!csun class"):
        response = show_classes(msg_split[2] + "", msg_split[3] + "");
        await message.channel.send("```" + response + "```")
    
    if message.content.__contains__("!csun sch"):
        response = show_schedule(msg_split[2] + "", msg_split[3] + "", msg_split[4] + "", msg_split[5] + "")
        await message.channel.send("```" + response + "```")
        
    if message.content.__contains__("!csun help"):
        to_show_class = "!csun class Subject ClassCode"
        c_example = "!csun class comp 182"
        to_show_schedule = "!csun sch Semester Year Subject ClassCode"
        s_example = "!csun sch spring 2022 comp 182"
        await message.channel.send("```To show a class and its description.\n\t" + to_show_class + 
                                   "\nExample:\n\t" + c_example +  
                                   "\n\n\nTo show the sections schedule for a specific class.\n\t" + to_show_schedule + 
                                   "\nExample:\n\t" + s_example + "```")
        


client.run(TOKEN)
