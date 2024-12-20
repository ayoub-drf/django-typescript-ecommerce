
import requests
from io import BytesIO
from django.core.files import File
from PIL import Image


def download_image_from_web():
    url = "https://lh3.googleusercontent.com/a/ACg8ocL042gj9cxxIelKDUuUuR9zG0BFjvqqcqj6luHJPf33n9P5PZw=s96-c"
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
        
status = True
usernames = {
    "name"
}
count = 1
while count < 20:
    print(f"james{count}")
    count += 1




