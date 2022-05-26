

vals = []

with open('input.txt') as input:
    for line in input:
        int_list = [int(i) for i in line.split()]
        #print (int_list)
        vals.append(int_list)

N = vals[0][0]
vals.pop(0)
# print(N)

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

for (int i = 1; i <= N; i++) {
            for (int j = 1; j <= N; j++) {
                if (checkUnstable(i, j)) {
                    notStable++;
                }
            }
        }

for i in range(1, N+1):
    for j in range(1, N+1):
        if (chec)



def check_unstable(currManID, currWomanID):
    pref_of_His_Match = -1
    pref_of_Her_Match = -1
    pref_of_currMan = -1
    pref_of_currWoman = -1
    herrCurrMatch = -1
    for i in range(0, N):
        if currWomanID == matchings[currManID - 1]:
            return False
    for i in range(0, N):
        if matchings[currManID - 1] == mensDesire[currManID - 1][i]:
            pref_of_His_Match = i
    for i in range(0, N):
        if matchings[i] == currWomanID:
            herrCurrMatch = matchings[i]
    for i in range(0, N):
        if herCurrMatch == womensDesire[currWomanID - 1][i]:
            pref_of_Her_Match = i
    for i in range(0, N):
        if currManID == womensDesire[currWomanID - 1][i]:
            pref_of_currMan = i
    for i in range(0, N):
        if currWomanID == mensDesire[currManID - 1][i]:
            pref_of_currWoman = i
    a = bool(pref_of_currWoman < pref_of_His_Match)
    b = bool(pref_of_currMan < pref_of_Her_Match)
    return a and b