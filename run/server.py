from flask import Flask
import time
import mariadb
import argparse
import os

parser = argparse.ArgumentParser()

parser.add_argument(
    "--project_location",
    nargs='?',
    type=str,
    help="Path to config file"
)

args = parser.parse_args()

if args.project_location:
    os.chdir(args.project_location)



app = Flask(__name__)

def name_normalize(str):
    return f"{str[0:1].upper()}{str[1:].lower()}"

def esta_conn():
    try:
        rootConnection = mariadb.connect(
            user="bot",
            password="hereisapassword2",
            host='127.0.0.1',
            port=3306,
            database='csun')
        return rootConnection.cursor()
    except mariadb.Error as err:
        print(f"Error connecting to MariaDB Platform: {err}")


@app.route('/<string:subject>-<string:catalog_number>/catalog')
def catalog(**kwargs):
    rootCursor = esta_conn()
    rootCursor.execute(f"""SELECT
                       subject,
                       catalog_number,
                       title,
                       description,
                       units,
                       prerequisites,
                       corequisites from catalog 
                       WHERE subject = '{kwargs['subject'].upper()}'
                       AND catalog_number = '{kwargs['catalog_number']}'
                       """)
    x = rootCursor.fetchone()

    return {"subject":x[0],
    "catalog_number":x[1],
    "title":x[2],
    "description":x[3],
    "units":x[4]} 
    
@app.route('/<string:subject>/levels/<string:level>')
def levels(**kwargs):
    rootCursor = esta_conn()
    rootCursor.execute(f"""SELECT
                       subject,
                       catalog_number,
                       title
                       from catalog 
                       WHERE subject = '{kwargs['subject'].upper()}'
                       AND catalog_number like '{kwargs['level'][0]}%'
                       """)
    fetch = rootCursor.fetchall()

    return [f"{x[0]} {x[1]} - {x[2]}" for x in fetch] 
    

@app.route('/<string:subject>-<string:catalog_number>/<string:semester>-<int:year>/schedule')
def schedule(**kwargs):
    # return json.load(open(f'./data/json_{kwargs["data"]}/{kwargs["subject"].upper()}_{kwargs["data"]}.json'))
    rootCursor = esta_conn()
    assert 'catalog_number' in kwargs
    rootCursor.execute(f"""SELECT 
                       class_number, 
                       enrollment_cap, 
                       enrollment_count, 
                       instructor, 
                       days, 
                       location, 
                       start_time, 
                       end_time, 
                       catalog_number, 
                       subject 
                       FROM section WHERE 
                       subject = '{kwargs['subject'].upper()}' 
                       AND catalog_number = '{kwargs['catalog_number']}'
                       AND semester = '{kwargs['semester']}'
                       AND year = {kwargs['year']}
                       """)
    le_fetch = rootCursor.fetchall()
    
    section_payload = [{"class_number": c[0],
             "enrollment_cap": c[1],
             "enrollment_count": c[2],
             "instructor": c[3],
             "days": c[4],
             "location": c[5],
             "start_time": c[6],
             "end_time": c[7],
             "catalog_number": c[8],
             "subject": c[9]} for c in le_fetch]
    return section_payload


@app.route('/profs/<string:subject>')
@app.route('/profs/<string:subject>/<int:id>')
def profs(**kwargs):
    rootCursor = esta_conn()
    try:
        rootCursor.execute(f"select first_name, last_name from professor where subject = '{kwargs['subject'].upper()}'")
        profs_as_first_last = sorted([f"{x[0]} {x[1]}" for x in rootCursor.fetchall()], key=lambda x:name_normalize(x.split(" ")[1]))
        rootCursor.execute(f"""select email, 
                               first_name, 
                               last_name, 
                               image_link, 
                               phone_number, 
                               location, 
                               website, 
                               mail_drop, 
                               subject, 
                               office from professor where 
                               first_name = '{profs_as_first_last[kwargs['id']-1].split(" ")[0]}' 
                               and 
                               last_name = '{profs_as_first_last[kwargs['id']-1].split(" ")[1]}'""")
        p = [{"email": x[0],
                     "first_name": name_normalize(x[1]),
                     "last_name": name_normalize(x[2]),
                     "image_link": x[3] if x[3] not in [None, ""] else "N/A",
                     "phone_number": x[4] if x[4] not in [None, ""] else "N/A",
                     "location": x[5] if x[5] not in [None, ""] else "N/A",
                     "website": x[6] if x[6] not in [None, ""] else "N/A",
                     "mail_drop": x[7] if x[7] not in [None, ""] else "N/A",
                     "subject": x[8] if x[8] not in [None, ""] else "N/A",
                     "office": x[9] if x[9] not in [None, ""] else "N/A"}
                    for x in rootCursor.fetchall()][0]
        
        

        rootCursor.execute(f"""select class_number, 
                                   enrollment_cap, 
                                   enrollment_count, 
                                   instructor, 
                                   days, 
                                   location, 
                                   start_time, 
                                   end_time, 
                                   catalog_number, 
                                   subject from section where instructor like '%{p['last_name'].split(',')[0]}%'
                                   and subject = '{kwargs['subject'].lower()}'
                                   and semester = 'fall'
                                   and year = '2023'
                                   """)
        
        
        
        p = {"info": p, "sch": [{"class_number": c[0],
                         "enrollment_cap": c[1],
                         "enrollment_count": c[2],
                         "instructor": c[3],
                         "days": c[4],
                         "location": c[5],
                         "start_time": c[6],
                         "end_time": c[7],
                         "catalog_number": c[8],
                         "subject": c[9]} for c in rootCursor.fetchall()] }
        # print(p)
        return p
    except KeyError:
        rootCursor.execute(f"select first_name, last_name from professor where subject = '{kwargs['subject'].upper()}'")
        profs = sorted([f"{name_normalize(x[0])} {name_normalize(x[1])}" for x in rootCursor.fetchall()], key=lambda x:x.split(" ")[1])
        return [f"{profs.index(x)+1} {x}\n" for x in profs]



app.run(port=2222)