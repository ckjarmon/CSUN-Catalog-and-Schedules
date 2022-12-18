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
TOKEN = os.getenv('DISCORD_TOKEN')




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

        blob_list.append("\n\tSection\t\tLocation\tDays\t Seats\t\t  Time\t\t\t\tFaculty")
        blob_list.append("\t-------\t\t--------\t----\t -----\t\t  ----\t\t\t\t-------")
        for course in data[f"{sub.upper()} {code}"]:
            section_string = []

            section_string.append("\t " + course["class_number"] + " ")
            if (len(course["location"]) == 3):
                section_string.append("  ")
                
            # Location 
            if (len(course["location"]) != 7):
                # (JD1600A is one character longer than all other class location strings, so it messes up tabs)
                section_string.append(f"\t\t{course['location']}")
            else:
                section_string.append(f"\t   {course['location']}")
                
                
            # Days
            if len(str(course["days"])) == 1:
                section_string.append(f"\t  {str(course['days'])}  ")
            elif len(str(course["days"])) == 2:
                section_string.append(f"\t {str(course['days'])}  ")
            elif len(str(course["days"])) == 3:
                section_string.append(f"\t {str(course['days'])} ")
            elif str(course["days"]) == "None":
                section_string.append("\t --  ")
            else:
                section_string.append(f"\t{str(course['days'])} ")
                # print(str(course["meetings"][0]["days"]))
                
                
            # Seats Available
            if len(str(course["enrollment_cap"] - course["enrollment_count"])) == 1:
                section_string.append(f"\t {str(course['enrollment_cap'] - course['enrollment_count'])}")
            else:
                section_string.append(f"\t{str(course['enrollment_cap'] - course['enrollment_count'])}")
            # Time 
            section_string.append(f"\t   {(course['start_time'])[0:2]}:{(course['start_time'])[2:4]} - {(course['end_time'])[0:2]}:{(course['end_time'])[2:4]}")
            # Instructor
            # if a class has no instructor, print Staff instead
            if course["instructor"] != "Staff":
                section_string.append(f"\t\t{course['instructor']}")
            else:
                section_string.append("\t\t   " + "Staff")
            blob_list.append(" ".join(section_string))
            print("------------------------------------------------------------------")
            print(section_string)
        return "\n".join([str(x) for x in blob_list])
            
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
    
    


    # for multi-class quieries
    muls = True
    if message.__contains__("!csun"):
        for i in range(1, len(msg_split)):
            if not isinstance(msg_split[i], int):
                muls = False
                break
            

    #await message.channel.send("```" + str(muls) + "```")
    
    if  len(msg_split) == 2:
        response1 = show_classes(msg_split[0], msg_split[1])
        response2 = show_schedule("Spring", "2023", msg_split[0], msg_split[1])
        await ctx.send("```" + str(response1) + "\n\n" + str(response2) + "```")
        
    elif message.__contains__("help"):
        await ctx.send("```Shows both class description and schedule by default. Only schedule is Spring 2023 \
                                   \nAbility view past schedules prior to Spring 2023 has been deprecated in this version.\n\n" +
                                   "Refer to the slash command /help (for the CSUN C&S bot) for instructions\n\n" + 
                                   "For multiple classes (in a single subject)\n\t!csun subject class_code class_code class_code" + 
                                   "\nExample:\n\t!csun comp 110 182 282\n\n" +
                                   "\nhttps://github.com/kyeou/Python-Scripts/tree/main/csun_catalog_and_schedules_bot```")
        
    elif muls:
        for i in range(1, len(msg_split)):
            response1 = show_classes(msg_split[0], msg_split[i])
            response2 = show_schedule("Spring", "2023", msg_split[0], msg_split[i])
            await ctx.send("```" + str(response1) + "\n\n" + str(response2) + "```")
    
            

    

    
        

client.run(TOKEN)
