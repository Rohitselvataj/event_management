import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/my-events/");
        if (res.data.events.length === 0) {
          setError("No events found.");
        } else {
          setEvents(res.data.events);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events.");
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">My Events</h1>
      {error ? (
        <p className="text-gray-600 text-lg">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white shadow-md p-4 rounded">
              <img
                src={`http://localhost:8000/media/${event.image}`}
                alt={event.title}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="text-xl font-semibold mt-2">{event.title}</h2>
              <p className="text-sm text-gray-500 mb-1">Venue: {event.venue}</p>
              <p className="text-sm text-gray-500 mb-3">
                Date: {event.start_date} to {event.end_date}
              </p>
              <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                Register
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
