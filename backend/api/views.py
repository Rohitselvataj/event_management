<think>
Okay, let's see what the user wants me to do. They provided a Python file with some code for a Django REST framework API and a list of fixes to apply. The task is to update the file content according to the fixes. 

First, I need to look at the fixes provided. The first fix is in the GenerateDescription class. The original code had permission_classes = [AllowAny], and the fix changes it to [IsAuthenticated]. The explanation says it's to restrict access to authenticated users for the AI generation endpoint.

The second fix is in the CreateEvent class. The original code had permission_classes set to [AllowAny] along with parser_classes. The fix changes the permission to [IsAuthenticated], so the lines are modified accordingly. The explanation mentions preventing unauthorized event creation and ensuring the user email is correctly derived from authenticated users.

Now, I need to go through the provided code and apply these changes. Let me look at the file content. 

Looking at the GenerateDescription class, I can see the line permission_classes = [AllowAny]. Changing that to [IsAuthenticated] should be straightforward. 

For the CreateEvent class, the original code has permission_classes = [AllowAny] and parser_classes = [MultiPartParser]. The fix replaces AllowAny with IsAuthenticated. The user provided the exact lines, so I need to replace the first line of that class accordingly.

I need to be careful not to alter anything else in the code. The rest of the file should remain unchanged. Let me double-check each part after applying the fixes to ensure I didn't miss anything. 

Once the changes are applied, the response should be the complete file content without any explanations. The user wants the raw updated code. Let me put it all together.
</think>

from rest_framework import generics
from .serializers import RegisterSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from django.core.files.storage import default_storage
import datetime
import google.generativeai as genai
from django.conf import settings
from .models import Event
from django.contrib.auth.models import User
from .serializers import EventSerializer  
from pymongo import MongoClient
import re , datetime, bcrypt, jwt

genai.configure(api_key="AIzaSyBn-CW1ByRNlFnJCWHK3hXXPOhzwaZAp8Y")

client = MongoClient("mongodb+srv://rohit:Rohit2004@cluster45.61avwkq.mongodb.net/")
db = client["event_db"]
event_col = db["events"]
users_col = db["users"]

SECRET = "secret_key"

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

def is_valid_password(pwd):
    return (
        len(pwd) >= 8 and
        re.search(r"[A-Z]", pwd) and
        re.search(r"[a-z]", pwd) and
        re.search(r"\d", pwd) and
        re.search(r"[!@#$%^&*(),.?\":{}|<>]", pwd)
    )

def is_alpha(name):
    return name.isalpha()


class RegisterUser(APIView):
    def post(self, request):
        data = request.data
        name = data.get("name", "").strip()
        email = data.get("email", "").lower()
        password = data.get("password", "")
        confirm_password = data.get("confirm_password", "")

        if not is_alpha(name):
            return Response({"error": "Name must be alphabetic"}, status=400)
        if not is_valid_email(email):
            return Response({"error": "Invalid email format"}, status=400)
        if not is_valid_password(password):
            return Response({"error": "Password does not meet complexity requirements"}, status=400)
        if password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=400)
        if users_col.find_one({"email": email}):
            return Response({"error": "Email already exists"}, status=400)

        hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
        users_col.insert_one({
            "name": name,
            "email": email,
            "password": hashed,
            "created_at": datetime.datetime.utcnow()
        })

        return Response({"message": "User registered successfully"})
    
class LoginUser(APIView):
    def post(self, request):
        data = request.data
        email = data.get("email", "").lower()
        password = data.get("password", "")

        user = users_col.find_one({"email": email})
        if not user:
            return Response({"error": "User not found"}, status=404)

        if not bcrypt.checkpw(password.encode(), user["password"]):
            return Response({"error": "Incorrect password"}, status=400)

        token = jwt.encode({"email": email, "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)}, SECRET)
        return Response({"token": token, "name": user["name"]})


class PublicEventList(APIView):

    permission_classes = [AllowAny]
    
    def get(self, request):
        event_type = request.GET.get("type", "")
        location = request.GET.get("location", "")
        date = request.GET.get("date", "")

        events = Event.objects.all()

        if event_type:
            events = events.filter(description__icontains=event_type)
        if location:
            events = events.filter(venue__icontains=location)
        if date:
            events = events.filter(start_date__lte=date, end_date__gte=date)

        serializer = EventSerializer(events, many=True)
        return Response({"events": serializer.data})

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
        
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)
            return Response({"description": response.text})
        except Exception as e:
            print("Gemini error:", e)
            return Response({"error": "AI generation failed"}, status=500)


class CreateEvent(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        user_email = None
        if request.user and request.user.is_authenticated:
            user_email = request.user.email
        else:
            user_email = "anonymous@example.com"
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
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            user_email = request.user.email
            docs = list(event_col.find({"user_email": user_email}))
        else:
            docs = list(event_col.find({}))  # return all events

        for d in docs:
            d["id"] = str(d["_id"])
            d.pop("_id", None)

        return Response({"events": docs})