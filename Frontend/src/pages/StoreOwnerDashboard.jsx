const apiUrl = import.meta.env.VITE_API_URL;
import { useEffect, useState } from "react";

// Star display helper (reuse if desired)
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

// Helper: group ratings by store_id
function groupRatingsByStore(ratings) {
  return ratings.reduce((groups, rating) => {
    if (!groups[rating.store_id]) groups[rating.store_id] = [];
    groups[rating.store_id].push(rating);
    return groups;
  }, {});
}

export default function StoreOwnerDashboard() {
  const [storeAverages, setStoreAverages] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setMsg("");
      try {
        const res = await fetch(`${apiUrl}/api/ratings/owner-dashboard`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) setMsg(data.error || "Failed to load dashboard.");
        setStoreAverages(data.storeAverages || []);
        setRatings(data.ratings || []);
      } catch {
        setMsg("Unable to fetch dashboard info.");
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  // Group all user ratings by store for display
  const ratingsByStore = groupRatingsByStore(ratings);

 return (
  <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-pink-100 to-purple-200 pt-24 pb-20 px-2 sm:px-4 lg:px-14">
    <h2 className="text-3xl font-bold text-center text-purple-700 mb-8 tracking-wide drop-shadow-lg">My Stores - Dashboard</h2>
    {msg && (
      <div className="max-w-lg mx-auto mb-6 px-5 py-3 rounded-xl bg-red-50 border-l-4 border-red-400 text-red-700 font-semibold shadow">
        {msg}
      </div>
    )}
    {loading && (
      <div className="text-center text-lg text-blue-800 mb-8">Loading...</div>
    )}

    {!loading && storeAverages?.length === 0 && (
      <div className="bg-white/60 px-6 py-4 rounded-xl text-gray-700 text-center text-lg font-semibold mx-auto mb-8 max-w-md shadow">
        You do not own any stores, or no ratings yet.
      </div>
    )}

    <div className="flex flex-col gap-12">
      {storeAverages.map(store => (
        <div
          key={store.store_id}
          className="glassmorphism-form px-6 py-8 rounded-3xl shadow-2xl border border-purple-200 w-full max-w-3xl mx-auto"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-purple-800 inline-flex items-center gap-3 mb-5">
            {store.store_name}
            <span className="text-base font-normal text-gray-700 ml-2">
              ({' '}
              <span className="inline-flex items-center">
                <RatingStars value={Number(store.avg_rating)} />
                <span className="ml-1 font-bold text-purple-700">
                  {typeof store.avg_rating !== "undefined" ? store.avg_rating : 0}
                </span>
              </span>
              )
            </span>
          </h3>
          <div className="overflow-x-auto mt-4">
  <div className="overflow-y-auto max-h-[320px] rounded-xl bg-white/30">
            <table className="w-full min-w-[370px] text-left text-base bg-transparent rounded-xl shadow">
              <thead>
                <tr className="bg-purple-100/50">
                  <th className="py-3 px-4 text-purple-800 font-bold">User Name</th>
                  <th className="py-3 px-4 text-purple-800 font-bold">User Email</th>
                  <th className="py-3 px-4 text-purple-800 font-bold">Rating</th>
                </tr>
              </thead>
              <tbody>
                {(ratingsByStore[store.store_id] || []).length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-5 px-4 text-center text-gray-600 font-medium">
                      No ratings yet for this store.
                    </td>
                  </tr>
                ) : (
                  ratingsByStore[store.store_id].map(r => (
                    <tr key={r.user_id} className="hover:bg-white/30 transition">
                      <td className="py-2 px-4">{r.name}</td>
                      <td className="py-2 px-4">{r.email}</td>
                      <td className="py-2 px-4 flex items-center gap-2">
                        <RatingStars value={Number(r.rating)} />
                        <span className="font-bold text-purple-700">({r.rating})</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

}
