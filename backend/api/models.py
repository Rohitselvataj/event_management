from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    venue = models.CharField(max_length=150)
    start_date = models.DateField()
    end_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    cost_type = models.CharField(max_length=100)
    image = models.ImageField(upload_to='event_images/')
    description = models.TextField()

    def __str__(self):
        return self.title
