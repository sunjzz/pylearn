
def bubble_sort(data):
    for i in range(len(data)-1):
        flag = True
        for j in range(len(data) - i - 1):
            if data[j] > data[j+1]:
                data[j], data[j+1] = data[j+1], data[j]
                flag = False
        if flag:
            return data
    return data


def choice_sort(data):
    for i in range(len(data) - 1):
        min_loc = i
        for j in range(i +1 , len(data)):
            if data[i] > data[j]:
                min_loc = j
        data[i], data[min_loc] = data[min_loc], data[i]
    return data


def insert_sort(data):
    for i in range(1, len(data)-1):
        tmp = data[i]
        j = i - 1
        while j >= 0 and data[j] > data[i]:
            data[j+1] = data[j]
            j -= 1
        data[i] = tmp
    return data


data = [1, 5, 2, 4, 9, 7, 8]
print(bubble_sort(data))
print(choice_sort(data))
print(insert_sort(data))