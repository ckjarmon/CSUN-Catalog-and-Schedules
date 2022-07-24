import json 
import os
import sys

print(os.getcwd())

with open("json_catalogs\\" + sys.argv[1].upper() + "_catalog", encoding='utf8') as in_file:
    data = json.load(in_file)
    for element in data:
        print("\n-------------------------------------------\n")
        print(element["subject"] + " " + element["catalog_number"] + " " + element["title"])
        if element["description"] != None:
            print(element["description"])