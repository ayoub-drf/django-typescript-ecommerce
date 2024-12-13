from django.dispatch import receiver
from django.db.models.signals import pre_save

from .models import (
    Product,
    Category,
)
from .utils import (
    create_unique_slug,
)

@receiver(pre_save, sender=Product)
def set_product_slug(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = create_unique_slug(instance.name, "product")

@receiver(pre_save, sender=Category)
def set_product_slug(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = create_unique_slug(instance.name, "category")


