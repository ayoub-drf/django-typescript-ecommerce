from django.contrib import admin
from .models import (
    CustomUser,
    Product,
    ProductImage,
    Category,
)

admin.site.register(CustomUser)

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'created', 'slug')

admin.site.register(Product, ProductAdmin)


admin.site.register(ProductImage)


admin.site.register(Category)

