from django.urls import path
from .views import RegisterView
from .views import GenerateDescription, CreateEvent,  EventListView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("gen-description/", GenerateDescription.as_view()),
    path("create-event/", CreateEvent.as_view()),
    path("my-events/", EventListView.as_view(), name="my_events"),
]
