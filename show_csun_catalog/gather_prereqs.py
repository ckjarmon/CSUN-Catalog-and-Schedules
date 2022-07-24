from cgi import test
import json

#class_codes = ["AE","AM","AAS","ACCT","AFRS","AIS","ANTH","ARAB","ARMN","ART","ASTR","AT","ATHL","BANA","BIOL","BLAW","BUS","CE","CADV","CAS","CCE","CD","CECS","CHS","CHEM","CHIN","CIT","CJS","CLAS","CM","COMP","COMS","CTVA","DEAF","EED","ECE","ECON","EDUC","ELPS","ENGL","ENT","EOH","EPC","FCFC","FCHC","FCS","FIN","FLIT","FREN","GBUS","GEOG","GEOL","GWS","HEBR","HHD","HIST","HSCI","HUM","INDS","IS","ITAL","JS","JAPN","JOUR","KIN","KNFC","KOR","LIB","LING","LRS","ME","MATH","MCOM","MGT","MKT","MSE","MUS","NURS","PERS","PHIL","PHSC","PHYS","POLS","PSY","PT","QS","RS","RE","RTM","RUSS","SED","SCI","SCM","SOC","SOM","SPAN","SPED","SUS","SUST","SWRK","TH","UNIV","URBS"]


# with open('input.json',encoding='utf8') as in_file:
#     data = json.load(in_file)
#     for element in data:
        

def 

def con_to_int(str):
    ret_value = -2
    try:
        ret_value = int(str)
    except:
        return ret_value
    return ret_value

test_string = "Prerequisites: Grade of C or better in MATH 102 103  104 105 150A or 255A or a passing score on the Math Placement Test (MPT) that satisfies prerequisites for MATH 150A or 255A . Corequisites: COMP 110L. Introduction to algorithms their representation design structuring analysis and optimization. Implementation of algorithms as structured programs in a high level language. Lab: three hours per week. (Available for General Education Lifelong Learning if required by students major.)\n"

string_to_find = "MATH"
if test_string.find(string_to_find) != -1:
    index_of_loc = test_string.find(string_to_find)
    test_result = string_to_find
    for i in range(index_of_loc + len(string_to_find), len(test_string)):
        if test_string[i] == " " or con_to_int(test_string[i]) != -2 or test_string[i] ==  'A' or test_string[i] == 'B':
            test_result += test_string[i]
        else:
            break
        if test_string.find("Corequisites") != -1
        
    print(test_result)


#while test_string[i] != "'\'":

