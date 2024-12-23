import requests
from io import BytesIO
from PIL import Image

from django.core.files import File
from django.utils.text import slugify


from .models import (
    Product,
    Category,
)


def download_image_from_web(url):
    req = requests.get(url)

    def is_image(file_path):
        try:
            with Image.open(file_path) as img:
                img.verify()
            return True
        except (IOError, SyntaxError):
            return False

    if req.status_code == 200:
        # convert the raw image content into file BytesIO object for dj file
        img_content = BytesIO(req.content)
        # Image url
        img_name = f"{url.split('/')[-1]}.png"
        # create a dj file object from BytesIO
        img_file = File(img_content, name=img_name)        
            
        if is_image(img_file):
            return img_file
        else:
            return False
        



def create_unique_slug(name, target):
    slug = slugify(name)
    unique_slug = slug

    if target == 'product':
        number = 1
        while Product.objects.filter(slug=unique_slug).exists():
            unique_slug = f"{slug}-{number}"
            number += 1
            
    elif target == 'category':
        number = 1
        while Category.objects.filter(slug=unique_slug).exists():
            unique_slug = f"{slug}-{number}"
            number += 1

            
    return unique_slug