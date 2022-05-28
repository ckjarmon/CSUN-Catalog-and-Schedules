vals = []

with open('input.txt') as input:
    for line in input:
        int_list = [int(i) for i in line.split()]
        #print (int_list)
        vals.append(int_list)
        
R = vals[0][0]
C = vals[0][1]
vals.pop(0);
bof = [False]*C
visited = [bof]*R
_puddles = 0;

def puddles(i, j):
    if not(i < 0 or j < 0 or i >= len(vals) or j >= len(vals[0]) or vals[i][j] != 0 or visited[i][j]):
        visited[i][j] = True;
        #need to mark all the adjacent indices to prevent double counting
        # up
        puddles(i - 1, j);
        # down
        puddles(i + 1, j);

        # left
        puddles(i, j - 1);
        # right
        puddles(i, j + 1);


def printBools():
    for s in visited:
        print(s)
    print()

#print(R)
#print(C)
#print(vals)
#print(visited)

for i in range(0, R):
    for j in range(0, C):
        if vals[i][j] == 0 and not(visited[i][j]): 
            puddles(i, j)
            _puddles+=1
    


print(_puddles)

""" input.txt
10 15
0 1 1 1 1 1 1 1 1 1 1 1 1 1 1
1 0 1 1 1 1 1 1 1 1 1 1 1 1 1
1 1 0 1 1 1 1 1 1 1 1 1 1 1 1
1 1 1 0 1 1 1 1 1 1 1 1 1 1 1
1 1 1 1 0 1 1 1 1 1 1 0 1 0 1
1 1 1 1 1 0 1 1 1 1 1 0 1 0 1
1 1 1 1 1 1 0 1 1 1 1 0 1 0 1
1 1 1 1 1 1 1 0 1 1 1 0 1 0 1
1 1 1 1 1 1 1 1 0 1 1 0 1 0 1
1 1 1 1 1 1 1 1 1 0 1 0 1 0 1
"""