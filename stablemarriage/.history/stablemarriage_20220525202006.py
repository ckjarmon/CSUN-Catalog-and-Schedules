

vals = []

with open('input.txt') as input:
    for line in input:
        int_list = [int(i) for i in line.split()]
        #print (int_list)
        vals.append(int_list)

N = vals[0][0]
vals.pop(0)
#print(N)

mens_desires = []
womens_desires = []
matchings = []

for i in range(0, N):
    mens_desires.append(vals[i])
    
#print (mens_desires)

for i in range(N, N*2):
    womens_desires.append(vals[i])
    
#print (womens_desires)

for i in range(N*2, N*3):
    matchings.append(vals[i][1])
    
#print (matchings)

def check_unstable(currManID, currWomanID):
    pref_of_His_Match = -1 
    pref_of_Her_Match = -1
    pref_of_currMan = -1
    pref_of_currWoman = -1
    for i in range(0, N):
        if currWomanID == matchings[currManID - 1]:
            return False
        
        
       