from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class RepresentativeOffices(models.Model):
    CityId = models.CharField(max_length=4, primary_key=True)
    CityName = models.CharField(max_length=50)
    OfficeAddress = models.CharField(max_length=100)
    State = models.CharField(max_length=100)
    Time = models.DateField()

    class Meta:
        db_table = 'RepresentativeOffices'


class Customers(models.Model):
    CustomerName = models.CharField(max_length=50)
    CustomerId = models.CharField(max_length=10, primary_key=True)
    CityId = models.ForeignKey(RepresentativeOffices, on_delete=models.CASCADE, db_column='CityId')
    FirstOrderDate = models.DateField(null=True)

    class Meta:
        db_table = 'Customers'


class TravelCustomers(models.Model):
    CustomerId = models.OneToOneField(Customers, primary_key=True, on_delete=models.CASCADE, db_column='CustomerId')
    TourGuide = models.CharField(max_length=50)
    Time = models.DateField()

    class Meta:
        db_table = 'TravelCustomers'


class PostalCustomers(models.Model):
    CustomerId = models.OneToOneField(Customers, primary_key=True, on_delete=models.CASCADE, db_column='CustomerId')
    PostAddress = models.CharField(max_length=50)
    Time = models.DateField()

    class Meta:
        db_table = 'PostalCustomers'


class Stores(models.Model):
    StoreId = models.CharField(max_length=10, primary_key=True)
    CityId = models.ForeignKey(RepresentativeOffices, on_delete=models.CASCADE, db_column='CityId')
    PhoneNumber = models.CharField(max_length=12)
    Time = models.DateField(null=True)

    class Meta:
        db_table = 'Stores'


class Items(models.Model):
    ItemId = models.CharField(max_length=10, primary_key=True)
    Descriptions = models.CharField(max_length=255)
    Size = models.CharField(max_length=20)
    Weight = models.IntegerField()
    Price = models.IntegerField()
    Time = models.DateField()

    class Meta:
        db_table = 'Items'


class StoredItems(models.Model):
    ItemId = models.ForeignKey(Items, on_delete=models.CASCADE, db_column='ItemId')
    StoreId = models.ForeignKey(Stores, on_delete=models.CASCADE, db_column='StoreId')
    StoredQuantity = models.IntegerField()
    Time = models.DateField(null=True)

    class Meta:
        db_table = 'StoredItems'
        constraints = [
            models.UniqueConstraint(fields=['ItemId', 'StoreId'], name='StoredItemKey')
        ]


class Orders(models.Model):
    OrderId = models.CharField(max_length=10, primary_key=True)
    OrderDate = models.DateField()
    CustomerId = models.ForeignKey(Customers, on_delete=models.CASCADE, db_column='CustomerId')

    class Meta:
        db_table = 'Orders'


class OrderedItems(models.Model):
    OrderId = models.ForeignKey(Orders, on_delete=models.CASCADE, db_column='OrderId')
    ItemId = models.ForeignKey(Items, on_delete=models.CASCADE, db_column='ItemId')
    OrderedQuantity = models.IntegerField()
    OrderCost = models.IntegerField()
    Time = models.DateField(null=True)

    class Meta:
        db_table = 'OrderedItems'
        constraints = [
            models.UniqueConstraint(fields=['ItemId', 'OrderId'], name='OrderedItemKey')
        ]
