

vals = []

with open('input.txt') as input:
    for line in input:
        int_list = [int(i) for i in line.split()]
        #print (int_list)
        vals.append(int_list)

N = vals[0][0]
vals.pop(0)
#print(N)

mensDesire = []
womensDesire = []
matchings = []

for i in range(0, N):
    mensDesire.append(vals[i])
    
#print (mens_desires)

for i in range(N, N*2):
    womensDesire.append(vals[i])
    
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
    for i in range(0, N):
        if matchings[currManID - 1] == mensDesire[currManID - 1][i]:
            pref_of_His_Match = i;
    for i in range(0, N):
        
    
       