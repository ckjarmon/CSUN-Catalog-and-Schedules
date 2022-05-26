

vals = []

with open('input.txt') as input:
    for line in input:
        int_list = [int(i) for i in line.split()]
        print (int_list)
        vals.append(int_list)

N = vals[0][0]
vals.pop(0)
print(N)

mens_desires = []

for i in range(0, N):
    mens_desires.append(vals[i])
    
print (mens_desires)

for i in range(N, N*2):
    mens_desires.append(vals[i])
    
print (mens_desires)