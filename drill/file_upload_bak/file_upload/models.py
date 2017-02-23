from django.db import models

KIND_CHIOCES = (
    ('Python技术', 'Python技术'),
    ('数据库技术', '数据库技术'),
    ('经济学','经济学'),
)


class Moment(models.Model):
    content = models.CharField(max_length=300)
    user_name = models.CharField(max_length=20, default="---")
    kind = models.CharField(max_length=20, choices=KIND_CHIOCES, default=KIND_CHIOCES[0])