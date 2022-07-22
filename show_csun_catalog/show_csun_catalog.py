import sys 
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import time

# Flag Order = Semester(ignore case) Year SubjectCode Optional(ClassCode)

catalog_link = 'https://cmsweb.csun.edu/psc/CNRPRD/EMPLOYEE/SA/c/NR_SSS_COMMON_MENU.NR_SSS_SOC_BASIC_C.GBL?PortalActualURL=https%3a%2f%2fcmsweb.csun.edu%2fpsc%2fCNRPRD%2fEMPLOYEE%2fSA%2fc%2fNR_SSS_COMMON_MENU.NR_SSS_SOC_BASIC_C.GBL&PortalContentURL=https%3a%2f%2fcmsweb.csun.edu%2fpsc%2fCNRPRD%2fEMPLOYEE%2fSA%2fc%2fNR_SSS_COMMON_MENU.NR_SSS_SOC_BASIC_C.GBL&PortalContentProvider=SA&PortalCRefLabel=Class%20Search&PortalRegistryName=EMPLOYEE&PortalServletURI=https%3a%2f%2fmynorthridge.csun.edu%2fpsp%2fPANRPRD%2f&PortalURI=https%3a%2f%2fmynorthridge.csun.edu%2fpsc%2fPANRPRD%2f&PortalHostNode=EMPL&NoCrumbs=yes&PortalKeyStruct=yes'

#https://www.stackvidhya.com/run-python-file-in-terminal/
def gather_data():
    print("Semester: " + sys.argv[1])
    print("Year: " + sys.argv[2])
    print("Subject: " + sys.argv[3])


section_number = [2233,2227,2225,2223,2221,2217,2215,2213,2211,2207,2205,2203,2201,2197,2195,2193,2191,2187,2185,2183,2181,2177,2175,2173,2171,2167,2165,2163,2161,2157,2155,2153,2151,2147,2145,2143,2141,2137,2135,2133,2131,2127,2125,2123,2121,2117,2115,2113,2111,2107,2105,2103,2101,2097,2095,2093,2091,2087,2085,2083,2081,2077,2075,2073,2071,2067,2065,2063,2061,2057,2055,2053,2051,2047,2045,2043,2041]
def match_st():
    term_string = sys.argv[1] + " " + sys.argv[2]
    match term_string:
        case 'Spring 2023':
            return section_number[0]
        case 'Fall 2022':  
            return section_number[1]
        case 'Summer 2022':
            return section_number[2]  
        case 'Spring 2022':
            return section_number[3]
        case 'Winter 2022':
            return section_number[4]
        case 'Fall 2021':
            return section_number[5]
        case 'Summer 2021':
            return section_number[6]
        case 'Spring 2021':
            return section_number[7]            
        case 'Winter 2021':
            return section_number[8]            
        case 'Fall 2020':
            return section_number[9]
        case 'Summer 2020':
            return section_number[10]
        case 'Spring 2020':
            return section_number[11]
        case 'Winter 2020':
            return section_number[12]
        case 'Fall 2019':
            return section_number[13]
        case 'Summer 2019':
            return section_number[14]
        case 'Spring 2019':
            return section_number[15]
        case 'Winter 2019':
            return section_number[16]
        case 'Fall 2018':
            return section_number[17]
        case 'Summer 2018':
            return section_number[18]
        case 'Spring 2018':
            return section_number[19]
        case 'Winter 2018':
            return section_number[20]
        case 'Fall 2017':
            return section_number[21]
        case 'Summer 2017':
            return section_number[22]
        case 'Spring 2017':
            return section_number[23]
        case 'Winter 2017':
            return section_number[24]
        case 'Fall 2016':
            return section_number[25]
        case 'Summer 2016':
            return section_number[26]
        case 'Spring 2016':
            return section_number[27]
        case 'Winter 2016':
            return section_number[28]
        case 'Fall 2015':
            return section_number[29]
        case 'Summer 2015':
            return section_number[30]            
        case 'Spring 2015':
            return section_number[31]            
        case 'Winter 2015':
            return section_number[32]            
        case 'Fall 2014':  
            return section_number[33]          
        case 'Summer 2014':
            return section_number[34]            
        case 'Spring 2014':
            return section_number[35]            
        case 'Winter 2014':
            return section_number[36]            
        case 'Fall 2013':  
            return section_number[37]          
        case 'Summer 2013':
            return section_number[38]            
        case 'Spring 2013':
            return section_number[39]            
        case 'Winter 2013':
            return section_number[40]           
        case 'Fall 2012':  
            return section_number[41]          
        case 'Summer 2012':
            return section_number[42]           
        case 'Spring 2012':
            return section_number[43]            
        case 'Winter 2012':
            return section_number[44]            
        case 'Fall 2011':  
            return section_number[45]          
        case 'Summer 2011':
            return section_number[46]           
        case 'Spring 2011':
            return section_number[47]           
        case 'Winter 2011':
            return section_number[48]           
        case 'Fall 2010':  
            return section_number[49]        
        case 'Summer 2010':
            return section_number[50]        
        case 'Spring 2010':
            return section_number[51]        
        case 'Winter 2010':
            return section_number[52]        
        case 'Fall 2009':  
            return section_number[53]      
        case 'Summer 2009':
            return section_number[54]       
        case 'Spring 2009':
            return section_number[55]        
        case 'Winter 2009':
            return section_number[56]        
        case 'Fall 2008':  
            return section_number[57]      
        case 'Summer 2008':
            return section_number[58]       
        case 'Spring 2008':
            return section_number[59]        
        case 'Winter 2008':
            return section_number[60]      
        case 'Fall 2007':  
            return section_number[61]      
        case 'Summer 2007':
            return section_number[62]      
        case 'Spring 2007':
            return section_number[63]      
        case 'Winter 2007':
            return section_number[64]       
        case 'Fall 2006':  
            return section_number[65]    
        case 'Summer 2006':
            return section_number[66]      
        case 'Spring 2006':
            return section_number[67]     
        case 'Winter 2006':
            return section_number[68]     
        case 'Fall 2005':  
            return section_number[69]   
        case 'Summer 2005':
            return section_number[70]      
        case 'Spring 2005':
            return section_number[71]     
        case 'Winter 2005':
            return section_number[72]           
        case 'Fall 2004':  
            return section_number[73]       
        case 'Summer 2004':
            return section_number[74]        
        case 'Spring 2004':
            return section_number[75]         
        case 'Winter 2004':
            return section_number[76]
            

print(match_st())

# Semester ID: NR_SSS_SOC_NWRK_STRM
# Subject ID: NR_SSS_SOC_NWRK_SUBJECT

s = Service(ChromeDriverManager().install())
op = webdriver.ChromeOptions()
op.add_experimental_option('excludeSwitches', ['enable-logging'])
driver = webdriver.Chrome(service=s,options=op)
driver.get(catalog_link)
time.sleep(4)


semester_box = driver.find_element("name", "NR_SSS_SOC_NWRK_STRM")
semester_box.click()

semester_box.send_keys(match_st())
#time.sleep(1)
semester_box.send_keys(Keys.ENTER)
#time.sleep(5)


id_box = driver.find_element("name", "NR_SSS_SOC_NWRK_SUBJECT")
id_box.click()
id_box.send_keys(sys.argv[3]) 
id_box.send_keys(Keys.ENTER)
time.sleep(3)

driver.find_element("name", "NR_SSS_SOC_NWRK_BASIC_SEARCH_PB").click()
time.sleep(5)

# Class Section Div ID: win0divNR_SSS_SOC_NSEC$(INDEX)
#   INDEX = classes listed in ascending order 

# Sesn = NR_SSS_SOC_NSEC_SESSION_CODE$0
# Section = NR_SSS_SOC_NSEC_CLASS_SECTION$0
# Class# = NR_SSS_SOC_NSEC_CLASS_NBR$0
# Seats = NR_SSS_SOC_NWRK_AVAILABLE_SEATS$0
# Status = NR_SSS_SOC_NWRK_DESCRSHORT$0
# Comp = NR_SSS_SOC_NSEC_SSR_COMPONENT$0
# Loc = MAP$0
# Days = NR_SSS_SOC_NWRK_DESCR20$0
# Time = NR_SSS_SOC_NSEC_DESCR25_2$0
# Instructor = FACURL$0


driver.find_element("id", "win0divSOC_DETAIL$0").click()
time.sleep(2)

row_sesn = driver.find_element("id","NR_SSS_SOC_NSEC_SESSION_CODE$0").text
row_section = driver.find_element("id","NR_SSS_SOC_NSEC_CLASS_SECTION$0").text
row_class = driver.find_element("id","NR_SSS_SOC_NSEC_CLASS_NBR$0").text
row_seats = driver.find_element("id","NR_SSS_SOC_NWRK_AVAILABLE_SEATS$0").text
row_status = driver.find_element("id","NR_SSS_SOC_NWRK_DESCRSHORT$0").text
row_comp = driver.find_element("id","NR_SSS_SOC_NSEC_SSR_COMPONENT$0").text
row_loc = driver.find_element("id","MAP$0").text
row_days = driver.find_element("id","NR_SSS_SOC_NWRK_DESCR20$0").text
row_time = driver.find_element("id","NR_SSS_SOC_NSEC_DESCR25_2$0").text
row_faculty = driver.find_element("id","FACURL$0").text

print("Session\tSection\tClass#\tSeats\tStatus\tComp\tLoc\tDays\tTime\t\tFaculty")
print(row_sesn + "\t" + row_section + "\t" + row_class + "\t" + row_seats + "\t" + row_status + "\t" + row_comp + "\t" + row_loc + "\t" + row_days + "\t" + row_time + "\t" +  row_faculty + "\n")

"""
Term Codes
"2233,">2233 - Spring 2023
"2227,">2227 - Fall 2022
"2225,">2225 - Summer 2022
"2223,">2223 - Spring 2022
"2221,">2221 - Winter 2022
"2217,">2217 - Fall 2021
"2215,">2215 - Summer 2021
"2213,">2213 - Spring 2021
"2211,">2211 - Winter 2021
"2207,">2207 - Fall 2020
"2205,">2205 - Summer 2020
"2203,">2203 - Spring 2020
"2201,">2201 - Winter 2020
"2197,">2197 - Fall 2019
"2195,">2195 - Summer 2019
"2193,">2193 - Spring 2019
"2191,">2191 - Winter 2019
"2187,">2187 - Fall 2018
"2185,">2185 - Summer 2018
"2183,">2183 - Spring 2018
"2181,">2181 - Winter 2018
"2177,">2177 - Fall 2017
"2175,">2175 - Summer 2017
"2173,">2173 - Spring 2017
"2171,">2171 - Winter  2017
"2167,">2167 - Fall 2016
"2165,">2165 - Summer 2016
"2163,">2163 - Spring 2016
"2161,">2161 - Winter 2016
"2157,">2157 - Fall 2015
"2155,">2155 - Summer 2015
"2153,">2153 - Spring 2015
"2151,">2151 - Winter 2015
"2147,">2147 - Fall 2014
"2145,">2145 - Summer 2014
"2143,">2143 - Spring 2014
"2141,">2141 - Winter 2014
"2137,">2137 - Fall 2013
"2135,">2135 - Summer 2013
"2133,">2133 - Spring 2013
"2131,">2131 - Winter 2013
"2127,">2127 - Fall 2012
"2125,">2125 - Summer 2012
"2123,">2123 - Spring 2012
"2121,">2121 - Winter 2012
"2117,">2117 - Fall 2011
"2115,">2115 - Summer 2011
"2113,">2113 - Spring 2011
"2111,">2111 - Winter 2011
"2107,">2107 - Fall 2010
"2105,">2105 - Summer 2010
"2103,">2103 - Spring 2010
"2101,">2101 - Winter 2010
"2097,">2097 - Fall 2009
"2095,">2095 - Summer 2009
"2093,">2093 - Spring 2009
"2091,">2091 - Winter 2009
"2087,">2087 - Fall 2008
"2085,">2085 - Summer 2008
"2083,">2083 - Spring 2008
"2081,">2081 - Winter 2008
"2077,">2077 - Fall 2007
"2075,">2075 - Summer 2007
"2073,">2073 - Spring 2007
"2071,">2071 - Winter 2007
"2067,">2067 - Fall 2006
"2065,">2065 - Summer 2006
"2063,">2063 - Spring 2006
"2061,">2061 - Winter 2006
"2057,">2057 - Fall 2005
"2055,">2055 - Summer 2005
"2053,">2053 - Spring 2005
"2051,">2051 - Winter 2005
"2047,">2047 - Fall 2004
"2045,">2045 - Summer 2004
"2043,">2043 - Spring 2004
"2041,">2041 - Winter 2004
"""