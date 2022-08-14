

import code
import shutil
import mysql.connector
from mysql.connector import errorcode
from dotenv import load_dotenv
import os
import json


load_dotenv()
dausername = os.getenv('sqlusername')
dapassword = os.getenv('sqlpass')


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
    create_section = (
'create table section ('
'subject_code varchar(5),'
'catalog_number varchar(7) ,'
'professor varchar(50) not null default "Staff",'
'section_number smallint not null,'
'location varchar(7) not null default "TBA",'
'start_time time not null,'
'end_time time not null,'
'days varchar(4) default "TBA",'
'seats_aval int'
)
    class_codes = ["AE","AM","AAS","ACCT","AFRS","AIS","ANTH","ARAB","ARMN","ART","ASTR","ATHL","BANA","BIOL","BLAW","BUS","CE","CADV","CAS","CCE","CD","CECS","CHS","CHEM","CHIN","CIT","CJS","CLAS","CM","COMP","COMS","CTVA","DEAF","EED","ECE","ECON","EDUC","ELPS","ENGL","EOH","EPC","FCS","FIN","FLIT","FREN","GBUS","GEOG","GEOL","GWS","HEBR","HIST","HSCI","HUM","INDS","IS","ITAL","JS","JAPN","JOUR","KIN","KNFC","KOR","LING","LRS","ME","MATH","MCOM","MGT","MKT","MSE","MUS","NURS","PERS","PHIL","PHSC","PHYS","POLS","PSY","PT","QS","RS","RE","RTM","RUSS","SED","SCI","SCM","SOC","SOM","SPAN","SPED","SUST","SWRK","TH","UNIV","URBS"]

    for class_code in class_codes:
        curr_sch = json.load(open("storedschedules/" + class_code.upper() + "_schedule.json"))
        # try:
            # subjectCodeAdd = ("INSERT INTO subject "
                            #    "(subject_code) "
                            #    "VALUES (%s)")
        # except Exception as e:
            # print(e)
        #rootCursor.execute(subjectCodeAdd, (class_code,))
        print(f"In the {class_code} gaffe")
        for sec in curr_sch["classes"]:    
            #print(sec)
            start_time = sec["meetings"][0]["start_time"][0:2] + ":" + sec["meetings"][0]["start_time"][2:4] + ":00"
            end_time =  sec["meetings"][0]["end_time"][0:2] + ":" + sec["meetings"][0]["end_time"][2:4] + ":00"
            
            sp = (sec["subject"], sec["catalog_number"], sec["instructors"][0]["instructor"], sec["class_number"], sec["meetings"][0]["location"], start_time, end_time, str(sec["meetings"][0]["days"]), str(sec["enrollment_cap"]))
            sectionAdd = ("insert into section (subject_code,catalog_number,professor,section_number,location,start_time,end_time,days,seats_aval)  values (%s, %s, %s, %s, %s, %s, %s, %s, %s)")
            
            rootCursor.execute(sectionAdd, sp)
            #selectTest = ('select * from section')

            rootConnection.commit()
        
        rootCursor.execute('select * from section where subject_code = %s', (class_code,))
        for row in rootCursor.fetchall():
            print(row)
            
    rootConnection.close()
#shutil.copy("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Data\\csun\\section.idb","C:\\Users\\kyeou\Dropbox\\PC (2)\\Desktop\\Stuff On Github\\Python-Scripts\\csun_catalog_and_schedules_bot\\sql\\csun\\section.idb" )
#shutil.copy("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Data\\csun\\subject.idb","C:\\Users\\kyeou\Dropbox\\PC (2)\\Desktop\\Stuff On Github\\Python-Scripts\\csun_catalog_and_schedules_bot\\sql\\csun\\subject.idb" )

