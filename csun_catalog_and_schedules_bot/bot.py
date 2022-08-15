# bot.py
import os
import urllib3
import json
import discord
from dotenv import load_dotenv
import time
import mysql.connector
from mysql.connector import errorcode


load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

client = discord.Client()


def show_classes(subject, number):
    sems = ["Fall", "Spring"]
    json_blobs = []
    
    for sem in sems:    
        url = u"https://api.metalab.csun.edu/curriculum/api/2.0/terms/" + sem + "-2022/courses/" + subject
        #print("\n Data Link: " + url)

        # try to read the data and load
        try:
            data = json.loads(urllib3.PoolManager().request("GET", url).data)
        except Exception as e:
            data = json.loads({})

        for course in data["courses"]:
            if (number == course["catalog_number"]):
                json_blobs.append(course)
                break
            
    if len(json_blobs) > 0:
        ret = str(json_blobs[0]["subject"].upper() + " " + json_blobs[0]["catalog_number"] + " " + json_blobs[0]["title"] + "\n\n")
        for a in json_blobs:
            if a["description"] is not None:
                ret += a["description"]
                break
        return ret




def show_schedule(sem, year, sub, code):
    if sem.lower() == "spring" and year == "2023":
        
        #data = json.load(open("storedschedules/" + sub.upper() + "_schedule.json"))
        load_dotenv()
        dausername = os.getenv('sqlusername')
        dapassword = os.getenv('sqlpass')
        request_tuple = (sub, code)
        data = {}
        try:
            rootConnection = mysql.connector.connect(
            user=dausername,
            password=dapassword,
            host='127.0.0.1',
            database='csun')
    
            rootCursor = rootConnection.cursor()
    
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
                print('Invalid credentials')
            elif err.errno == errorcode.ER_BAD_DB_ERROR:
                print('Database not found')
            else:
                print('Cannot connect to database:', err)

        else:
            rootCursor.execute('select * from section where subject_code = %s and catalog_number = %s', request_tuple)
            stuffs = rootCursor.fetchall()
            
            for row in stuffs:
                temp_dict = {}
                temp_dict["catalog_number"] = row[1]
                temp_dict["title"] = row[9]
                temp_dict["meetings"] = []
                temp_dict["meetings"].append({})
                temp_dict["meetings"][0]["days"] = row[7]
                temp_dict["meetings"][0]["location"] = row[4]
                temp_dict["meetings"][0]["start_time"] = row[5]
                temp_dict["meetings"][0]["end_time"] = row[6]
                temp_dict["class_number"] = str(row[3])
                temp_dict["enrollment_cap"] = row[8]
                temp_dict["enrollment_count"] = 0
                temp_dict["instructors"] = []
                temp_dict["instructors"].append({})
                temp_dict["instructors"][0]["instructor"] = row[2]
                data["classes"].append(temp_dict)
            rootConnection.close()

                
        
    else:
        url = u"https://api.metalab.csun.edu/curriculum/api/2.0/terms/" + sem + "-" + \
                                                                          year + "/classes/" + \
                                                                          sub
            # try to read the data and load
        try:
            data = json.loads(urllib3.PoolManager().request("GET", url).data)
        except Exception as e:
            data = json.loads({})

    def find_class(current_class):
        ret_value = ""
        for course in data["classes"]:
            if (current_class == course["catalog_number"]):
                ret_value = course["title"]
        return ret_value

    blob_list = []
    curr_time = time.asctime(time.localtime(time.time())).split()
    blob_list.append(sub.upper() + " " + code + " " +
                     find_class(code) + " - " + sem.upper() + " " + year + 
                     " - As of " + curr_time[0] + " " + curr_time[2] + " " + curr_time[1] + " "  + curr_time[4] + " " + curr_time[3])
    blob_list.append(
        "\n\tSection\t\tLocation\tDays\t\t Seats Aval\t\t\t  Time\t\t\t\tFaculty")
    blob_list.append(
        "\t-------\t\t--------\t----\t\t ----------\t\t\t  ----\t\t\t\t-------")

    for course in data["classes"]:
        # if a class has no meetings, it should not be on schedule
        if (len(course["meetings"]) > 0) and code == course["catalog_number"]:
            section_string = []
          
            section_string.append("\t " + course["class_number"] + " ")
            
            if (len(course["meetings"][0]["location"]) == 3):
                
                section_string.append("  ")
            
            # Location 
            if (len(course["meetings"][0]["location"]) != 7):
                # (JD1600A is one character longer than all other class location strings, so it messes up tabs)
                section_string.append("\t\t" + course["meetings"][0]["location"])
                
            else:
                section_string.append("\t   " + course["meetings"][0]["location"])
                
            # Days
            if len(str(course["meetings"][0]["days"])) == 1:
                section_string.append("\t  " + str(course["meetings"][0]["days"]) + "  ")

            elif len(str(course["meetings"][0]["days"])) == 2:
                section_string.append("\t " + str(course["meetings"][0]["days"]) + "  ")
            
            elif len(str(course["meetings"][0]["days"])) == 3:
                section_string.append("\t " + str(course["meetings"][0]["days"]) + " ")
                
            elif str(course["meetings"][0]["days"]) == "None":
                section_string.append("\t --  ")
                
            else:
                section_string.append("\t" + str(course["meetings"][0]["days"]) + " ")
                # print(str(course["meetings"][0]["days"]))

            
            # Seats Available
            if len(str(course["enrollment_cap"] - course["enrollment_count"])) == 1:
                section_string.append("\t\t    " + str(course["enrollment_cap"] - course["enrollment_count"]))
                
            else:
                section_string.append("\t\t   " + str(course["enrollment_cap"] - course["enrollment_count"]))

            # Time 
            section_string.append("\t\t    " +
                                  (course["meetings"][0]["start_time"])[0:2] + ":" +
                                  (course["meetings"][0]["start_time"])[2:4]
                                  + " - " +
                                  (course["meetings"][0]["end_time"])[0:2] + ":" +
                                  (course["meetings"][0]["end_time"])[2:4])

            # Instructor
            # if a class has no instructor, print Staff instead
            if (len(course["instructors"]) > 0) and course["instructors"][0]["instructor"] != "Staff":
                section_string.append("\t" + course["instructors"][0]["instructor"])
            else:
                section_string.append("\t\t\t" + "Staff")

            blob_list.append(" ".join(section_string))
            print("------------------------------------------------------------------")
            print(section_string)
    return "\n".join([str(x) for x in blob_list])


@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')


@client.event
async def on_message(message):
    if message.author == client.user:
        return

    msg_split = message.content.split()
    print(message.author, end="")
    print(" [" + message.content + "]")

    if message.content.__contains__("!csun") and len(msg_split) == 3:
        response1 = show_classes(msg_split[1], msg_split[2])
        response2 = show_schedule("Fall", "2022", msg_split[1], msg_split[2])
        await message.channel.send("```" + str(response1) + "\n\n" + str(response2) + "```")
        
    elif message.content.__contains__("!csun grade"):
        grade = 0
        total_weight = 0
        for i in range(2, int(len(msg_split)-2/2)+1, 2):
            grade += (float(msg_split[i]) * (float(msg_split[i+1]))/100)
            total_weight += float(msg_split[i+1])
            #await message.channel.send("```" + str(i) + "```")
        await message.channel.send("```" + str(grade) + "```")
        if total_weight != 100.0:
            await message.channel.send("```Warning: Weights don't total 100.```")
            
    elif len(msg_split) > 3 and message.content.__contains__("!csun"):
        response1 = show_classes(msg_split[1], msg_split[2])
        response2 = show_schedule(msg_split[3], "20" + msg_split[4], msg_split[1], msg_split[2])
        await message.channel.send("```" + str(response1) + "\n\n" + str(response2) + "```")

    elif message.content.__contains__("!csun help"):
        await message.channel.send("```Shows both class description and schedule by default. Default schedule is Fall 2022 \
                                   \nTo show different schedule, append it to the end.\n\n" +
                                   "For default:\n\t!csun subject class_code\nExample:\n\t!csun comp 182\n\n" + 
                                   "For Different Semester:\n\t!csun subject class_code semester YY\n" +
                                   "Example:\n\t!csun subject class_code spring 23\n\n" + 
                                   "For Grade:\n\t!csun grade (grade weight)*\n"  + 
                                   "Example:\n\t!csun grade 74 25 85 35 70 40\n\nSource Code: \
                                   \nhttps://github.com/kyeou/Python-Scripts/tree/main/csun_catalog_and_schedules_bot```")
        
    
        

client.run(TOKEN)
