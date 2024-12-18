from django.contrib import admin
from .models import (
    CustomUser,
    Product,
    ProductImage,
    Category,
    Order,
    OrderItems,
)

admin.site.register(CustomUser)

admin.site.register(Order)

admin.site.register(OrderItems)

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'created', 'slug')

admin.site.register(Product, ProductAdmin)


admin.site.register(ProductImage)


admin.site.register(Category)

