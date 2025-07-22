from rest_framework import generics
from .serializers import RegisterSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
from django.core.files.storage import default_storage
import datetime
import google.generativeai as genai
from django.conf import settings
from .models import Event  # Your Event model
from django.contrib.auth.models import User
from .serializers import EventSerializer  
from pymongo import MongoClient


genai.configure(api_key="AIzaSyBn-CW1ByRNlFnJCWHK3hXXPOhzwaZAp8Y")

client = MongoClient("mongodb+srv://rohit:Rohit2004@cluster45.61avwkq.mongodb.net/")  # or MongoDB Atlas URI
db = client["event_db"]
event_col = db["events"]

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class GenerateDescription(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        title = request.data.get("title")
        venue = request.data.get("venue")
        prompt = f"Write a short engaging event description for an event titled '{title}' at '{venue}'"
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return Response({"description": response.text})

class CreateEvent(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        user_email = request.user.email
        title = request.data.get("title")
        venue = request.data.get("venue")
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")
        start_time = request.data.get("start_time")
        end_time = request.data.get("end_time")
        cost_type = request.data.get("cost_type")
        description = request.data.get("description")
        image = request.FILES.get("image")

        if not image.name.lower().endswith(('.jpg', '.jpeg', '.png')) or image.size > 5 * 1024 * 1024:
            return Response({"error": "Invalid image"}, status=400)

        filename = default_storage.save(image.name, image)

        event_doc = {
            "user_email": user_email,
            "title": title,
            "venue": venue,
            "start_date": start_date,
            "end_date": end_date,
            "start_time": start_time,
            "end_time": end_time,
            "cost_type": cost_type,
            "description": description,
            "image": filename,
            "created_at": datetime.datetime.utcnow()
        }

        event_col.insert_one(event_doc)
        return Response({"message": "Event created"})


class EventListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_email = request.user.email
        docs = list(event_col.find({"user_email": user_email}))

        for d in docs:
            d["id"] = str(d["_id"])
            d.pop("_id", None)

        return Response({"events": docs})
