

vals = []

with open('input.txt') as input:
    for line in input:
        int_list = [int(i) for i in line.split()]
        print (int_list)
        vals.append(int_list)

print(vals)
vals.pop(0)
print()
        