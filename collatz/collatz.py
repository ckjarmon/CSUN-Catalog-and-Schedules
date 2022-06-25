
f = open("D://results.txt", 'w')

for i in range(1, 5000000):
    number = i
    f.write(str(number))
    f.write(": ")
    while (number != 1):
        if (number % 2 == 0):
            number = number/2
            f.write(str(number))
            f.write(" ")
        else:
            number = (number*3)+1
            f.write(str(number))
            f.write(" ")
    f.write("\n")
    print(i)
f.close()