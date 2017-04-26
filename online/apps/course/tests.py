from django.test import TestCase

# Create your tests here.

from random import randint
d = { x : randint(60,100) for x in range(1, 21)}
print(d)
