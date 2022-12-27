from flask import Flask
import json
import time
import hashlib
import mariadb

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

@app.route('/<string:subject>/<string:data>')
def get(**kwargs):
    return json.load(open(f'./json_{kwargs["data"]}/{kwargs["subject"].upper()}_{kwargs["data"]}.json'))

@app.route('/time')
def stime():
    curr_time = time.asctime(time.localtime(time.time())).split()
    return (f" - As of {curr_time[0]} {curr_time[2]} {curr_time[1]} {curr_time[4]} {curr_time[3]}")

@app.route('/profs/<string:subject>')
@app.route('/profs/<string:subject>/<int:id>')
def profs(**kwargs):

    rootCursor = esta_conn()
    
    
    # print(sum([len(x) for x in profs]))
    try:
        rootCursor.execute(f"select first_name, last_name from professor where subject = '{kwargs['subject'].upper()}'")
        nn_profs = sorted([f"{x[0]} {x[1]}" for x in rootCursor.fetchall()], key=lambda x:name_normalize(x.split(" ")[1]))
        rootCursor.execute(f"""select email, 
                               first_name, 
                               last_name, 
                               image_link, 
                               phone_number, 
                               location, 
                               website, 
                               mail_drop, 
                               subject, 
                               office from professor where first_name = '{nn_profs[kwargs['id']-1].split(" ")[0]}' and last_name = '{nn_profs[kwargs['id']-1].split(" ")[1]}'""")
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
                                   subject from section where instructor like '%{p['last_name'].split(',')[0]}%'""")
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
        print(p)
        return p
    except KeyError:
        rootCursor.execute(f"select first_name, last_name from professor where subject = '{kwargs['subject'].upper()}'")
        profs = sorted([f"{name_normalize(x[0])} {name_normalize(x[1])}" for x in rootCursor.fetchall()], key=lambda x:x.split(" ")[1])
        return [f"{profs.index(x)+1} {x}\n" for x in profs]



app.run(port=2222)