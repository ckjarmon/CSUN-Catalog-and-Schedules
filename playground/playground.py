import json
import mariadb
import hashlib
import pprint

class_codes = ["AE", "AM", "AAS", "ACCT", "AFRS", "AIS", "ANTH", "ARAB", "ARMN", "ART", "ASTR", "AT", "ATHL", "BANA", "BIOL", "BLAW", "BUS", "CE", "CADV", "CAS", "CCE", "CD", "CECS", "CHS", "CHEM", "CHIN", "CIT", "CJS", "CLAS", "CM", "COMP", "COMS", "CTVA", "DEAF", "EED", "ECE", "ECON", "EDUC", "ELPS", "ENGL", "ENT", "EOH", "EPC", "FCFC", "FCHC", "FCS", "FIN", "FLIT", "FREN", "GBUS", "GEOG", "GEOL", "GWS", "HEBR", "HHD", "HIST", "HSCI", "HUM", "INDS", "IS", "ITAL", "JS", "JAPN", "JOUR", "KIN", "KNFC", "KOR", "LIB", "LING", "LRS", "ME", "MATH", "MCOM", "MGT", "MKT", "MSE", "MUS", "NURS", "PERS", "PHIL", "PHSC", "PHYS", "POLS", "PSY", "PT", "QS", "RS", "RE", "RTM", "RUSS", "SED", "SCI", "SCM", "SOC", "SOM", "SPAN", "SPED", "SUS", "SUST", "SWRK", "TH", "UNIV", "URBS"];
 
try:
    rootConnection = mariadb.connect(
        user="root",
        password=json.load(open("secret.json", "r"))["db_pass"],
        host='127.0.0.1',
        port=3306,
        database='csun')
    rootCursor =  rootConnection.cursor()
except mariadb.Error as err:
    print(f"Error connecting to MariaDB Platform: {err}")
        
def a():
    

    rootCursor.execute("select distinct email from professor")
    
    

    profs = [x[0] for x in rootCursor.fetchall()]
    
    for r in profs:
        print(f"{r} {hashlib.sha3_256(r.encode()).hexdigest()}")
       
        rootCursor.execute(f"""SELECT 
                                   class_number, 
                                   enrollment_cap, 
                                   enrollment_count,  
                                   days, 
                                   location, 
                                   start_time, 
                                   end_time, 
                                   catalog_number, 
                                   subject  from section where instructor = '{r}'""")
        
        json.dump([{"class_number": c[0], 
                         "enrollment_cap": c[1], 
                         "enrollment_count": c[2], 
                         "days": c[3], 
                         "location": c[4], 
                         "start_time": c[5], 
                         "end_time": c[6], 
                         "catalog_number": c[7], 
                         "subject": c[8]} for c in rootCursor.fetchall()], open(f"json_prof_sp23/{hashlib.sha3_256(r.encode()).hexdigest()}.json", "w"), indent=4)



def b():
    rootCursor.execute("select last_name from professor")
    lastnames = [c[0] for c in rootCursor.fetchall()]
    
    common = {}
    
    for ls in lastnames:

        # print(ls)
        rootCursor.execute(f"select email from professor where last_name = %s", (ls,))
        for r in rootCursor.fetchall():
            #print(r)
            try:
                common[ls].add(r[0])
            except KeyError:
                common[ls] = {r[0]}
                
    
    from collections import OrderedDict
    
    common = OrderedDict(sorted(common.items()))
    
    for key in common.keys():
        if len(common[key]) > 1:
            print(key)
            pprint.pprint(common[key])


def is_cap(str): 
    if str.split(" ")[0][0] != str.split(" ")[0][0].upper() or str.split(" ")[0][1:] != str.split(" ")[0][1:].lower():
        return False
    return True
    

def c():
    rootCursor.execute("select first_name, last_name from professor")
    for r in rootCursor.fetchall():
        if not is_cap(r[0]) or not is_cap(r[1]) and r[1][1:3] != "Mc" and not r[1].__contains__("'") and not r[1].__contains__("-"):
            print(r) 

    

if __name__ == '__main__':
    c() 
    