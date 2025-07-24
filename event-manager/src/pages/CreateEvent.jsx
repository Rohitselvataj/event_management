import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

const CreateEvent = () => {
  const [form, setForm] = useState({
    title: "",
    venue: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    cost_type: "",
    image: null,
    description: "",
  });

  const [error, setError] = useState({});
  const [genStatus, setGenStatus] = useState("");
  const navigate = useNavigate(); // ✅ navigation hook

  const validate = () => {
    const err = {};
    if (!form.title || form.title.length > 50) err.title = "Title required (max 50 chars)";
    if (!form.venue || form.venue.length > 150) err.venue = "Venue required (max 150 chars)";
    if (!form.start_date || !form.end_date) err.date = "Start and end date required";
    if (form.start_date > form.end_date) err.date = "Start date must be before end date";
    if (!form.image) err.image = "Image required";
    else {
      const ext = form.image.name.split(".").pop().toLowerCase();
      if (!["jpg", "jpeg", "png"].includes(ext)) err.image = "Only jpg/jpeg/png allowed";
      if (form.image.size > 5 * 1024 * 1024) err.image = "Max file size 5MB";
    }
    return err;
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const generateDescription = async () => {
    setGenStatus("Generating...");
    try {
      const res = await axios.post("/api/gen-description/", {
        title: form.title,
        venue: form.venue,
      });
      setForm({ ...form, description: res.data.description });
      setGenStatus("Generated");
    } catch (err) {
      setGenStatus("Error generating description");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valErr = validate();
    if (Object.keys(valErr).length > 0) return setError(valErr);

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "image") data.append("image", form.image);
      else data.append(key, form[key]);
    });

    try {
      await axios.post("/api/create-event/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Event created successfully!");
      navigate("/"); // ✅ Navigate to dashboard after success
    } catch (err) {
      alert("Error creating event.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Create Event</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
        >
          Go to Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* --- INPUT FIELDS --- */}
        <input type="text" placeholder="Title" maxLength={50}
          value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded" />
        {error.title && <p className="text-red-500 text-sm">{error.title}</p>}

        <input type="text" placeholder="Venue" maxLength={150}
          value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })}
          className="w-full border p-2 rounded" />
        {error.venue && <p className="text-red-500 text-sm">{error.venue}</p>}

        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            className="border p-2 rounded" />
          <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            className="border p-2 rounded" />
        </div>
        {error.date && <p className="text-red-500 text-sm">{error.date}</p>}

        <div className="grid grid-cols-2 gap-2">
          <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            className="border p-2 rounded" />
          <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            className="border p-2 rounded" />
        </div>

        <input type="text" placeholder="Cost Type (e.g. Free, Paid)"
          value={form.cost_type} onChange={(e) => setForm({ ...form, cost_type: e.target.value })}
          className="w-full border p-2 rounded" />

        <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImageChange}
          className="w-full border p-2 rounded" />
        {error.image && <p className="text-red-500 text-sm">{error.image}</p>}

        <div className="flex gap-2 items-center">
          <button type="button" onClick={generateDescription}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Generate Description</button>
          <span className="text-sm">{genStatus}</span>
        </div>

        <textarea rows={5} value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Event Description"
          className="w-full border p-2 rounded" />

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
