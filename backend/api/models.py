from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.urls import reverse

class CustomUser(AbstractUser):
    google_id = models.CharField(max_length=300, null=True, blank=True)
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to="profiles/%Y/%m/%d/", default='profiles/avatar.png')
    bio = models.TextField(default='', blank=True)
    reset_password_token = models.CharField(max_length=400, null=True, blank=True)
    reset_password_token_expires_at = models.DateTimeField(null=True, blank=True)
    verification_code = models.CharField(max_length=6, null=True, blank=True)
    verification_code_expires_at = models.DateTimeField(null=True, blank=True)

    REQUIRED_FIELDS = ('username', )
    USERNAME_FIELD = 'email'
    def __str__(self):
        return self.username

class CommonFields(models.Model):
    name = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class Product(CommonFields):
    image = models.ImageField(upload_to="products/main-image/%Y/%m/%d/", default='products/products-example.png')
    slug = models.SlugField(unique=True, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=33.1)
    category = models.ForeignKey('Category', related_name='products', on_delete=models.CASCADE)

    class Meta:
        ordering = ("-updated", "-created",)
        verbose_name = _("Product")
        verbose_name_plural = _("Products")


    def __str__(self):
        return f"{self.name}"

    # def get_absolute_url(self):
    #     return reverse("_detail", kwargs={"pk": self.pk})

class ProductImage(CommonFields):
    name = None
    image = models.ImageField(upload_to="products/images/%Y/%m/%d/", default='products/products-example.png')
    product = models.ForeignKey('Product', related_name='images', on_delete=models.CASCADE)

    class Meta:
        ordering = ("-updated", "-created",)
        verbose_name = "Product Image"
        verbose_name_plural = "Product Images"

    def __str__(self):
        return f'{self.product.name} - ProductImage'
    

class Category(CommonFields):
    slug = models.SlugField(unique=True, null=True, blank=True)

    class Meta:
        ordering = ("-updated", "-created",)
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")


    def __str__(self):
        return f"{self.name}"

    # def get_absolute_url(self):
    #     return reverse("_detail", kwargs={"pk": self.pk})


class Order(CommonFields):
    name = None
    email = models.CharField(max_length=300)
    address = models.CharField(max_length=300)
    postalCode = models.CharField(max_length=300)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"order id {self.email}"
    

    def total_price(self):
        total = sum(item.product.price * item.quantity for item in self.order_items.all())
        # if not isinstance(total, float) or not isinstance(total, int):
        #     total = int(total)

        return total


class OrderItems(CommonFields):
    name = None
    order = models.ForeignKey('Order', related_name='order_items', on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return f"order id {self.order.id} : product id {self.product.id}"


