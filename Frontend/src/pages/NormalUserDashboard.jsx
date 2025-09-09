const apiUrl = import.meta.env.VITE_API_URL;
import { useEffect, useState } from "react";

// Optional utility to show colored stars
function RatingStars({ value = 0 }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map(num => (
        <span
          key={num}
          style={{ color: num <= value ? "gold" : "#bbb", fontSize: "18px" }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function NormalUserDashboard() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all stores (with search if any)
  const fetchStores = async () => {
    setLoading(true);
    setMessage("");
    let url = `${apiUrl}/api/stores`;
    if (search) url += `?q=${encodeURIComponent(search)}`;
    try {
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        setStores([]);
        setMessage(data.error || "Failed to fetch stores");
      } else {
        setStores(Array.isArray(data.stores) ? data.stores : []);
      }
    } catch {
      setMessage("Unable to fetch stores.");
      setStores([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line
  }, []);

  // Submit or update the rating for a specific store
  const handleRating = async (store_id, rating) => {
    setMessage("");
    try {
      const res = await fetch(`${apiUrl}/api/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ store_id, rating }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to submit rating.");
        return;
      }
      setMessage("Rating submitted!");
      fetchStores();
    } catch {
      setMessage("Unable to submit rating.");
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-pink-100 to-purple-200 pt-24 pb-20 px-2 sm:px-4 lg:px-14">
    <h2 className="text-3xl font-bold text-center text-blue-700 mb-10 tracking-wide drop-shadow-lg">Stores</h2>
    
    {/* Search Bar */}
    <form
      onSubmit={e => {
        e.preventDefault();
        fetchStores();
      }}
      className="flex flex-wrap items-center gap-4 bg-white/40 backdrop-blur-xl rounded-2xl border border-blue-200 shadow-md p-6 max-w-2xl mx-auto mb-8"
    >
      <input
        type="text"
        placeholder="Search by name or address..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="block flex-1 min-w-[120px] max-w-xs px-4 py-2 rounded-xl border-2 border-blue-200 bg-white/70 text-base shadow focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="py-2 px-7 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Search
      </button>
    </form>

    {message && (
      <div className="max-w-xl mx-auto mb-6 px-5 py-3 rounded-xl bg-red-50 border-l-4 border-red-400 text-red-700 font-semibold shadow">
        {message}
      </div>
    )}

    <div className="bg-white/30 backdrop-blur-2xl rounded-3xl border border-blue-200 shadow-lg max-w-5xl mx-auto p-4 mb-12 overflow-x-auto">
      <div className="overflow-y-auto max-h-[350px]">
        <table className="w-full min-w-[560px] text-left text-base rounded-xl bg-transparent">
          <thead>
            <tr className="bg-blue-100/60">
              <th className="py-3 px-4 text-blue-800 font-bold">Store Name</th>
              <th className="py-3 px-4 text-blue-800 font-bold">Address</th>
              <th className="py-3 px-4 text-blue-800 font-bold">Avg Rating</th>
              <th className="py-3 px-4 text-blue-800 font-bold">Your Rating</th>
              <th className="py-3 px-4 text-blue-800 font-bold">Rate This Store</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-6 px-4 text-center text-blue-700 font-semibold">Loading...</td>
              </tr>
            ) : stores.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 px-4 text-center text-gray-600 font-medium">No stores found.</td>
              </tr>
            ) : (
              stores.map(store => (
                <tr key={store.id} className="hover:bg-white/30 transition">
                  <td className="py-2 px-4">{store.name}</td>
                  <td className="py-2 px-4">{store.address}</td>
                  <td className="py-2 px-4 flex items-center gap-2">
                    <RatingStars value={Number(store.avg_rating)} />
                    <span className="text-blue-800 font-bold">{typeof store.avg_rating !== "undefined" ? store.avg_rating : "N/A"}</span>
                  </td>
                  <td className="py-2 px-4">
                    {store.user_rating ? (
                      <span className="flex items-center gap-2">
                        <RatingStars value={Number(store.user_rating)} />
                        <span className="text-purple-700 font-bold">({store.user_rating})</span>
                      </span>
                    ) : (
                      <span className="text-gray-500">Not rated</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <select
                      value={store.user_rating || ""}
                      onChange={e => {
                        const val = Number(e.target.value);
                        if (val >= 1 && val <= 5) handleRating(store.id, val);
                      }}
                      className="px-3 py-2 rounded-xl border-2 border-blue-200 bg-white/80 text-base shadow focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    >
                      <option value="">Rate</option>
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

}
