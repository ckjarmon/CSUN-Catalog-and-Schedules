# bot.py
import numbers
import os

import urllib3
import json
import discord
from dotenv import load_dotenv
import time
import mysql.connector
from mysql.connector import errorcode
from discord import Intents
from discord.ext import commands

# intents = discord.Intents().all()
# client = commands.Bot(command_prefix=',', intents=intents)

intents = Intents.default()
intents.message_content = True

client = commands.Bot(command_prefix="!", intents=intents)

load_dotenv()
TOKEN = json.load(open("config.json", "r"))["token"]




def show_classes(subject, number):
    data = json.load(open('json_catalog/' + subject.upper() + '_catalog.json'))
    for course in data:
        if (number == course["catalog_number"]):
            return f"{course['subject'].upper()} {course['catalog_number']} {course['title']}\n\n{course['description']}"





def show_schedule(sem, year, sub, code):
    if sem.lower() == "spring" and year == "2023":
        
        data = json.load(open("json_schedule/" + sub.upper() + "_schedule.json"))          
        
        def find_class(current_class):
            for course in json.load(open("json_catalog/" + sub.upper() + "_catalog.json"))   :
                if (current_class == course["catalog_number"]):
                    return course["title"]
        
        blob_list = []
        curr_time = time.asctime(time.localtime(time.time())).split()
        blob_list.append(f"{sub.upper()} {code} {find_class(code)} - {sem.upper()} {year} - As of {curr_time[0]} {curr_time[2]} {curr_time[1]} {curr_time[4]} {curr_time[3]}")

        blob_list.append("\n\tSection\t\tLocation\tDays\t Seats\t Waitlist Queue\t\t  Time\t\t\t\tFaculty")
        blob_list.append("\t-------\t\t--------\t----\t -----\t --------------\t\t  ----\t\t\t\t-------")
        try:    
            for sec in data[f"{sub.upper()} {code}"].keys():
                section_string = []
                curr_sec = data[f'{sub.upper()} {code}'][sec]
                section_string.append("\t " + curr_sec["class_number"] + " ")
                if (len(curr_sec["location"]) == 3):
                    section_string.append("  ")

                # Location 

                if (len(curr_sec["location"])) == 5:
                    section_string.append(f" \t\t{curr_sec['location']}")
                elif (len(curr_sec["location"]) != 7):
                    # (JD1600A is one character longer than all other class location strings, so it messes up tabs)
                    section_string.append(f"\t\t{curr_sec['location']}")                
                else:
                    section_string.append(f"\t   {curr_sec['location']}")


                # Days
                if len(str(curr_sec["days"])) == 1:
                    section_string.append(f"\t  {str(curr_sec['days'])}  ")
                elif len(str(curr_sec["days"])) == 2:
                    section_string.append(f"\t {str(curr_sec['days'])}  ")
                elif len(str(curr_sec["days"])) == 3:
                    section_string.append(f"\t {str(curr_sec['days'])} ")
                elif str(curr_sec["days"]) == "None":
                    section_string.append("\t --  ")
                else:
                    section_string.append(f"\t{str(curr_sec['days'])} ")
                    # print(str(curr_sec["meetings"][0]["days"]))


                # Seats Available
                if len(str(curr_sec["enrollment_cap"] - curr_sec["enrollment_count"])) == 1:
                    section_string.append(f"\t {str(curr_sec['enrollment_cap'] - curr_sec['enrollment_count'])}")
                else:
                    section_string.append(f"\t{str(curr_sec['enrollment_cap'] - curr_sec['enrollment_count'])}")


                # Next Waitlist Position
                if curr_sec["waitlist_cap"] != 0:
                    section_string.append(f"\t\t     {str(curr_sec['waitlist_count'] + 1)}\t")
                else:
                    section_string.append(f"\t\t   N/A\t")    


                # Time 
                section_string.append(f"\t   {(curr_sec['start_time'])[0:2]}:{(curr_sec['start_time'])[2:4]} - {(curr_sec['end_time'])[0:2]}:{(curr_sec['end_time'])[2:4]}")
                # Instructor
                # if a class has no instructor, print Staff instead
                if curr_sec["instructor"] != "Staff":
                    section_string.append(f"\t{curr_sec['instructor']}")
                else:
                    section_string.append("\t\t   " + "Staff")
                blob_list.append(" ".join(section_string))
                print("------------------------------------------------------------------")
                print(section_string)
            return "\n".join([str(x) for x in blob_list])
        except KeyError:
            return f"{sub.upper()} {code} ain't being taught bruv, feels bad" 
"""        
    else:
        url = u"https://api.metalab.csun.edu/curriculum/api/2.0/terms/" + sem + "-" + \
                                                                          year + "/classes/" + \
                                                                          sub
            # try to read the data and load
        print(url)
        try:
            data = json.loads(urllib3.PoolManager().request("GET", url).data)
        except Exception as e:
            data = json.loads({})

        def find_class(current_class):
            ret_value = ""
            import pprint
            pprint.pprint(data)
            for course in data:
                if (current_class == course["catalog_number"]):
                    ret_value = course["title"]
            return ret_value

        blob_list = []
        curr_time = time.asctime(time.localtime(time.time())).split()
        blob_list.append(f"{sub.upper()} {code} {find_class(code)} - {sem.upper()} {year} - As of {curr_time[0]} {curr_time[2]} {curr_time[1]} {curr_time[4]} {curr_time[3]}")

        blob_list.append("\n\tSection\t\tLocation\tDays\t Seats\t\t  Time\t\t\t\tFaculty")
        blob_list.append("\t-------\t\t--------\t----\t -----\t\t  ----\t\t\t\t-------")

        for course in data["catalog_number"]:
            # if a class has no meetings, it should not be on schedule
            if (len(course["meetings"]) > 0) and code == course["catalog_number"]:
                section_string = []

                section_string.append("\t " + course["class_number"] + " ")

                if (len(course["meetings"][0]["location"]) == 3):

                    section_string.append("  ")

                # Location 
                if (len(course["meetings"][0]["location"]) != 7):
                    # (JD1600A is one character longer than all other class location strings, so it messes up tabs)
                    section_string.append(f"\t\t{course['meetings'][0]['location']}")

                else:
                    section_string.append(f"\t   {course['meetings'][0]['location']}")

                # Days
                if len(str(course["meetings"][0]["days"])) == 1:
                    section_string.append(f"\t  {str(course['meetings'][0]['days'])}  ")

                elif len(str(course["meetings"][0]["days"])) == 2:
                    section_string.append(f"\t {str(course['meetings'][0]['days'])}  ")

                elif len(str(course["meetings"][0]["days"])) == 3:
                    section_string.append(f"\t {str(course['meetings'][0]['days'])} ")

                elif str(course["meetings"][0]["days"]) == "None":
                    section_string.append("\t --  ")

                else:
                    section_string.append(f"\t{str(course['meetings'][0]['days'])} ")
                    # print(str(course["meetings"][0]["days"]))


                # Seats Available
                if len(str(course["enrollment_cap"] - course["enrollment_count"])) == 1:
                    section_string.append(f"\t {str(course['enrollment_cap'] - course['enrollment_count'])}")

                else:
                    section_string.append(f"\t{str(course['enrollment_cap'] - course['enrollment_count'])}")

                # Time 
                section_string.append(f"\t   {(course['meetings'][0]['start_time'])[0:2]}:{(course['meetings'][0]['start_time'])[2:4]} - {(course['meetings'][0]['end_time'])[0:2]}:{(course['meetings'][0]['end_time'])[2:4]}")

                # Instructor
                # if a class has no instructor, print Staff instead
                if (len(course["instructors"]) > 0) and course["instructors"][0]["instructor"] != "Staff":
                    section_string.append(f"\t{course['instructors'][0]['instructor']}")
                else:
                    section_string.append("\t\t   " + "Staff")

                blob_list.append(" ".join(section_string))
                print("------------------------------------------------------------------")
                print(section_string)
        return "\n".join([str(x) for x in blob_list])
"""

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')


@client.command()
async def csun(ctx, *message):
    
    
    message = ' '.join(message)
    
    print(f"{ctx} {message}")
    

    if ctx.author == client.user:
        return

    msg_split = message.split()
    print(ctx.author, end="")
    print(f"{ctx.author} [{message}]")
    
    
    

    ls = 0
    i = 1   
    while True:
        try:    
            if not msg_split[i].isnumeric():
                ls = i
                i += 1
         
            response1 = show_classes(msg_split[ls], msg_split[i])
            response2 = show_schedule("Spring", "2023", msg_split[ls], msg_split[i])
            i += 1
            await ctx.send("```" + str(response1) + "\n\n" + str(response2) + "```")        
        except IndexError:
            break

        
    if message.__contains__("help"):
        await ctx.send("```Shows both class description and schedule by default. Only schedule is Spring 2023 \
                                   \nAbility view past schedules prior to Spring 2023 has been deprecated in this version.\n\n" +
                                   "Refer to the slash command /help (for the CSUN C&S bot) for instructions\n\n" + 
                                   "For multiple classes (in a single subject)\n\t!csun subject class_code class_code class_code" + 
                                   "\nExample:\n\t!csun comp 110 182 282\n\n" +
                                   "\nhttps://github.com/kyeou/Python-Scripts/tree/main/csun_catalog_and_schedules_bot```")
        
    

    
            

    

    
        

client.run(TOKEN)
