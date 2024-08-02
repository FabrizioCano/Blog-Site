from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from sorl.thumbnail import ImageField
# Create your models here.
from PIL import Image
class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )
    image=ImageField(upload_to='profiles')
    def __str__(self):
        return self.user.username
    
    
""" cuando un usuario sea guardado, ejecutar la funcion crar perfil de usuario """
@receiver(post_save,sender=User)
def create_user_profile(sender,instance,created,**kwargs):
    """ CREAR UN NUEVO OBJETO DE PERFIL CUANDO UN USUARIO DE DJANGO SEA CREADO """
    if created:
        Profile.objects.create(user=instance)
        

# resizing images
