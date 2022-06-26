# Files will be organized by type into a parent folder called "Org by Py"

# Org by Py will contain folders with the names of the extension of the files
# they contain.

# For example "Org by Py" -> "pdfs" "jpegs" "pngs" and so on.

# This program will only organize pngs, jpegs, pdfs, mp4s, and zips.

# THe folder names will be plural -> "pdfs"

# Every other file type will be a folder called misc.

import os
import shutil
import glob

#mp4s, zips, pngs, jpegs, pdfs
print("\n")
directory = "Org by Py"
namesOfFolders = ["pdfs", "jpegs", "pngs", "mp4s", "zips"]
parentDir = "/Users/kyeou/Dropbox/Mac/Desktop/ptf_ignore/"
try:
    shutil.rmtree("/Users/kyeou/Dropbox/Mac/Desktop/ptf_ignore/Org by Py")
except OSError as error:
    print("Folder doesn't exist")

path = os.path.join(parentDir, directory)
os.mkdir(path)
print("Org by Python folder has been made\n")

# making folders for every type
for n in range(len(namesOfFolders)):
    try:
        directory = namesOfFolders[n]
        path = os.path.join(parentDir, directory)
        os.mkdir(path)
        print(namesOfFolders[n] + " folder has been made")
    except OSError as error:
        continue

print("\nlisting directories")
dirlist = os.listdir(parentDir)
print(dirlist)

# dircheck
#parentDir = os.chdir("/Users/kyeou/Dropbox/Mac/Desktop/ptf_ignore/")
print("\nCurrent working directory is")
print(os.getcwd())


# moving unique files types into their respective folders

#parentDir = "/Users/kyeou/Dropbox/Mac/Desktop/ptf_ignore/"
for i in range(5):
    for filenames in glob.glob("*." + namesOfFolders[i][0:len(namesOfFolders[i]) - 1]):
        source = os.path.join(parentDir, filenames)
        dest = os.path.join(parentDir, namesOfFolders[i])
        shutil.move(source, dest)


print("\nMoving folders into Org by Python\n")

for n in range(len(namesOfFolders)):
    try:
        folderToMove = "/Users/kyeou/Dropbox/Mac/Desktop/ptf_ignore/" + \
            namesOfFolders[n]
        os.chdir(folderToMove)
        print("Moving folder at " + folderToMove)
        shutil.move(
            folderToMove, "/Users/kyeou/Dropbox/Mac/Desktop/ptf_ignore/Org by Py")
    except OSError as error:
        print("shit didnt work")
        print(namesOfFolders[n])
        continue
print("\nAll folders are now in Org by Python\n")

parentDir = "/Users/kyeou/Dropbox/Mac/Desktop/ptf_ignore/Org by Py"
print("\nlisting directories in Org by Py")
dirlist = os.listdir(parentDir)
print(dirlist)

parentDir = "/Users/kyeou/Dropbox/Mac/Desktop/ptf_ignore/"
print("\nlisting directories in ptf_ignore")
dirlist = os.listdir(parentDir)
print(dirlist)
