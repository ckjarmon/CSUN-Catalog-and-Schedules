from selenium.common.exceptions import NoSuchElementException
import sys
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import time
import json

#class_codes = ["AE","AM","AAS","ACCT","AFRS","AIS","ANTH","ARAB","ARMN","ART","ASTR","AT","ATHL","BANA","BIOL","BLAW","BUS","CE","CADV","CAS","CCE","CD","CECS","CHS","CHEM","CHIN","CIT","CJS","CLAS","CM","COMP","COMS","CTVA","DEAF","EED","ECE","ECON","EDUC","ELPS","ENGL","ENT","EOH","EPC","FCFC","FCHC","FCS","FIN","FLIT","FREN","GBUS","GEOG","GEOL","GWS","HEBR","HHD","HIST","HSCI","HUM","INDS","IS","ITAL","JS","JAPN","JOUR","KIN","KNFC","KOR","LIB","LING","LRS","ME","MATH","MCOM","MGT","MKT","MSE","MUS","NURS","PERS","PHIL","PHSC","PHYS","POLS","PSY","PT","QS","RS","RE","RTM","RUSS","SED","SCI","SCM","SOC","SOM","SPAN","SPED","SUS","SUST","SWRK","TH","UNIV","URBS"]
class_codes = ["COMP"]

catalog_link = 'https://cmsweb.csun.edu/psc/CNRPRD/EMPLOYEE/SA/c/NR_SSS_COMMON_MENU.NR_SSS_SOC_BASIC_C.GBL?PortalActualURL=https%3a%2f%2fcmsweb.csun.edu%2fpsc%2fCNRPRD%2fEMPLOYEE%2fSA%2fc%2fNR_SSS_COMMON_MENU.NR_SSS_SOC_BASIC_C.GBL&PortalContentURL=https%3a%2f%2fcmsweb.csun.edu%2fpsc%2fCNRPRD%2fEMPLOYEE%2fSA%2fc%2fNR_SSS_COMMON_MENU.NR_SSS_SOC_BASIC_C.GBL&PortalContentProvider=SA&PortalCRefLabel=Class%20Search&PortalRegistryName=EMPLOYEE&PortalServletURI=https%3a%2f%2fmynorthridge.csun.edu%2fpsp%2fPANRPRD%2f&PortalURI=https%3a%2f%2fmynorthridge.csun.edu%2fpsc%2fPANRPRD%2f&PortalHostNode=EMPL&NoCrumbs=yes&PortalKeyStruct=yes'

s = Service(ChromeDriverManager().install())
op = webdriver.ChromeOptions()
op.add_argument('headless')
op.add_experimental_option('excludeSwitches', ['enable-logging'])
driver = webdriver.Chrome(service=s, options=op)


def convert_time(time):
    if (time == "TBA"): 
        return "0000h", "0000h"
    start_hour = int(time[0:1])
    start_is_am = True if (time[5:6] == "am") else False
    end_hour =  int(time[8:9])
    end_is_am = True if (time[13:14] == "am") else False
    
    if not start_is_am:
        start_hour += 12
    if not end_is_am:
        end_hour += 12
        
    return str(start_hour) + time[2:3] + "h", str(end_hour) + time[10:11] + "h"

driver.get(catalog_link)
time.sleep(4)

semester_box = driver.find_element("name", "NR_SSS_SOC_NWRK_STRM")
semester_box.click()

semester_box.send_keys(2227)
# time.sleep(1)
semester_box.send_keys(Keys.ENTER)
# time.sleep(5)
time.sleep(2)


id_box = driver.find_element("id", "NR_SSS_SOC_NWRK_SUBJECT")
id_box.click()
id_box.send_keys("COMP") # for scode in class_classcodes
time.sleep(1)
id_box.send_keys(Keys.ENTER)
  
    
driver.find_element("name", "NR_SSS_SOC_NWRK_BASIC_SEARCH_PB").click()
time.sleep(2)
for code in class_codes:
    file1 = open(code + "_catalog.json", "w")
    json_blob = []
    course_dict = {}
    driver.get(catalog_link)
    time.sleep(1)

    semester_box = driver.find_element("name", "NR_SSS_SOC_NWRK_STRM")
    semester_box.click()

    semester_box.send_keys(2227)
    # time.sleep(1)
    semester_box.send_keys(Keys.ENTER)
    # time.sleep(5)
    time.sleep(2)


    id_box = driver.find_element("id", "NR_SSS_SOC_NWRK_SUBJECT")
    id_box.click()
    id_box.send_keys(code) # for scode in class_classcodes
    time.sleep(1)
    id_box.send_keys(Keys.ENTER)
  
    
    driver.find_element("name", "NR_SSS_SOC_NWRK_BASIC_SEARCH_PB").click()
    time.sleep(2)
   
    for a in range(0, 60): 
        try:
            print(driver.find_element("id", "NR_SSS_SOC_NWRK_DESCR100_2$" + str(a)).text)
            driver.find_element("id", "win0divSOC_DETAIL$" + str(a)).click()
            time.sleep(1)
            print(
                "Session\tSection\tClass#\tSeats\tStatus\tComp\tLoc\tDays\tTime\t\t   Faculty")
            for i in range(0, 20):
                try:
                    # print("Session\tSection\tClass#\tSeats\tStatus\tComp\tLoc\tDays\tTime\t\t   Faculty")
                    course_dict["section"] = driver.find_element(
                        "id", "NR_SSS_SOC_NSEC_CLASS_NBR$" + str(i)).text
                    # row_section = driver.find_element(
                    #     "id", "NR_SSS_SOC_NSEC_CLASS_NBR$" + str(i)).text
                    
                    course_dict["enrollment_cap"] = int(driver.find_element(
                        "id", "NR_SSS_SOC_NWRK_AVAILABLE_SEATS$" + str(i)).text)
                    course_dict["enrollment_count"] = 0
                    
                    # row_seats = driver.find_element(
                    #     "id", "NR_SSS_SOC_NWRK_AVAILABLE_SEATS$" + str(i)).text

                    meetings = {}
                    meetings["days"] = driver.find_element(
                        "id", "NR_SSS_SOC_NWRK_DESCR20$" + str(i)).text if (len(driver.find_element(
                        "id", "NR_SSS_SOC_NWRK_DESCR20$" + str(i)).text) > 0) else "A"
                        
                    meetings["location"] = driver.find_element("id", "MAP$" + str(i)).text
                    meetings["start_time"], meetings["end_time"] = convert_time(driver.find_element(
                        "id", "NR_SSS_SOC_NSEC_DESCR25_2$" + str(i)).text)
                    
                    instructors = {}
                   # course_dict["meetings"].append(meetings)
                    
                    # row_loc = driver.find_element("id", "MAP$" + str(i)).text
                    # row_days = driver.find_element(
                    #     "id", "NR_SSS_SOC_NWRK_DESCR20$" + str(i)).text


                    # row_time = driver.find_element(
                    #     "id", "NR_SSS_SOC_NSEC_DESCR25_2$" + str(i)).text


                    try:
                        # row_faculty = driver.find_element(
                        #     "id", "FACURL$" + str(i)).text

                        instructors["instructor"] = (driver.find_element(
                            "id", "FACURL$" + str(i)).text)
                    except NoSuchElementException:
                        # row_faculty = "Staff"
                        instructors.append("Staff")
                        
                    meetings["instructors"].append(instructors)    
                    course_dict["meetings"].append(meetings)
                    json_blob.append(course_dict)
                except NoSuchElementException:
                    i = 20
            driver.find_element("id", "win0divSOC_DETAIL1$" + str(a)).click()
            time.sleep(1)
        except NoSuchElementException:
            a = 60
    random_dict = {}
    random_dict["classes"] = json_blob
    json.dump(random_dict, file1, indent=4)
    file1.close()
    