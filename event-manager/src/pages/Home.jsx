import { useEffect, useState } from "react";
import axios from "../utils/axios";

const Home = () => {
  const [filters, setFilters] = useState({ type: "", location: "", date: "" });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await axios.get("/public-events/", { params: filters });
      const data = res.data.events;
      setEvents(data);
      setNotFound(data.length === 0);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* HERO SECTION */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Discover Events Near You</h1>
        <p className="text-gray-600 mt-2">Browse events by type, location and date</p>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <input type="text" placeholder="Type (e.g. Tech, Music)"
          onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="p-2 border rounded" />

        <input type="text" placeholder="Location"
          onChange={(e) => setFilters({ ...filters, location: e.target.value })} className="p-2 border rounded" />

        <input type="date"
          onChange={(e) => setFilters({ ...filters, date: e.target.value })} className="p-2 border rounded" />
      </div>

      {/* EVENTS */}
      {loading ? (
        <p className="text-center text-gray-500">Loading events...</p>
      ) : notFound ? (
        <p className="text-center text-red-500">No events found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e) => (
            <div key={e.id} className="border p-4 rounded shadow bg-white">
              <img src={`http://localhost:8000/media/${e.image}`} alt="event" className="w-full h-40 object-cover mb-2" />
              <h2 className="font-bold text-xl">{e.title}</h2>
              <p className="text-gray-600">{e.venue}</p>
              <p>{e.start_date} – {e.end_date}</p>
              <p>{e.start_time} – {e.end_time}</p>
              <p className="text-sm font-semibold text-blue-600">{e.cost_type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
