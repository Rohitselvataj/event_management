from django.urls import path
from .views import RegisterView
from .views import GenerateDescription, CreateEvent,  EventListView, PublicEventList
from .views import RegisterUser, LoginUser
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
     path("gen-description/", GenerateDescription.as_view(), name="generate-description"),
    path("create-event/", CreateEvent.as_view(), name="create-event"),
    path('api/my-events/', EventListView.as_view(), name='my-events'),
    path("user/signup/", RegisterUser.as_view()),
    path("user/login/", LoginUser.as_view()),
    path("public-events/", PublicEventList.as_view()),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
