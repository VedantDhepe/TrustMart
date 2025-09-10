// src/pages/AdminDashboard.js
const apiUrl = import.meta.env.VITE_API_URL;
import { useEffect, useState } from "react";
import {toast} from "react-toastify"
import { FaStar } from "react-icons/fa";
export default function AdminDashboard() {
  const [totals, setTotals] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [userSearch, setUserSearch] = useState("");
  const [userSortBy, setUserSortBy] = useState("");
  const [userOrder, setUserOrder] = useState("asc");
  const [creatingUser, setCreatingUser] = useState(false);
const [creatingStore, setCreatingStore] = useState(false);
const [usersApplying, setUsersApplying] = useState(false);
const [storesApplying, setStoresApplying] = useState(false);
const [loadingUserId, setLoadingUserId] = useState(null);    // For per-user Delete
const [loadingStoreId, setLoadingStoreId] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "normal",
  });

  const handleUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };


  const [newStore, setNewStore] = useState({
    name: "", email: "", address: "", owner_id: null
  });

  const [storeOwners, setStoreOwners] = useState([]);

  const handleStoreChange = (e) => {
    setNewStore({ ...newStore, [e.target.name]: e.target.value });
  };

  const createUser = async (e) => {
    e.preventDefault();
   setCreatingUser(true);
    const res = await fetch(`${apiUrl}/api/users/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newUser),
    });
    setCreatingUser(false);
    if (res.ok) { 
      toast.success("User created Successfully!");
      setNewUser({ name: "", email: "", address: "", password: "", role: "normal" });
      fetchUsers();
    } else {
       const result = await res.json();
        toast.error(result.error.message)
    }
  };





  const createStore = async (e) => {
    e.preventDefault();
    setCreatingStore(true);
    const res = await fetch(`${apiUrl}/api/stores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newStore),
    });
    setCreatingStore(false);
    if (res.ok) {
      toast.success("Store created!");
      setNewStore({ name: "", email: "", address: "", owner_id: null });
      fetchStores();
    } else {
      const err = await res.json();
      toast.error("Failed: " + (err.error || "Unknown error"));
    }
  };


  useEffect(() => {
    // Fetch totals
    fetch(`${apiUrl}/api/dashboard/totals`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setTotals(data));

    // Fetch all users
    fetch(`${apiUrl}/api/users`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setUsers(data.users);
        const owners = data.users.filter(u => u.role === "store_owner");
        setStoreOwners(owners);
      });
      

    // Fetch all stores
    fetch(`${apiUrl}/api/stores/all`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setStores(data.stores)});
  }, []);

// Search filter Functionality to display users
  const fetchUsers = async () => {
  const params = new URLSearchParams();
  if (userSearch) params.append("q", userSearch);
  if (userSortBy) params.append("sortBy", userSortBy);
  if (userOrder) params.append("order", userOrder);
  setUsersApplying(true);
  await fetch(`${apiUrl}/api/users?${params.toString()}`, {
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => setUsers(data.users));
    setUsersApplying(false);
};

// Search filter Functionality to display stores
  const fetchStores = async () => {
      const params = new URLSearchParams();
      if (search) params.append("q", search);
      if (sortBy) params.append("sortBy", sortBy);
      if (order) params.append("order", order);
       setStoresApplying(true);
      await fetch(`${apiUrl}/api/stores/all?${params.toString()}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setStores(data.stores)});
      setStoresApplying(false);
    };

    const deleteUser =  async (e) => {
                      if (window.confirm("Delete this user?")) {
                        setLoadingUserId(e);
                        const res = await fetch(`${apiUrl}/api/users/${e}`, {
                          method: "DELETE",
                          credentials: "include",
                        });
                        setLoadingUserId(null);
                        if(!res.ok){
                          toast.error("OOPs, there is a relation of this user with a store, hence can't delete for now. Please Try with a normal user. I (developer) will handle this issue later", {autoClose : 3000})
                        }
                        else{
                          const result = await res.json();
                            toast.success("User deleted");
                            fetchUsers();
                        }
                      }
    }

    const deleteStore = async (id) => {
  if (window.confirm("Delete this store?")) {
    setLoadingStoreId(id);
    const res = await fetch(`${apiUrl}/api/stores/${id}`, { method: "DELETE", credentials: "include" });
    setLoadingStoreId(null);
    if (res.ok) {
      toast.success("Store Deleted");
      fetchStores();
    } else {
      toast.error("OOPs, ...", { autoClose: 3000 });
    }
  }
};



                    
  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-pink-100 to-purple-200 pt-10 px-2 sm:px-4 lg:px-14">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8 tracking-wide drop-shadow-lg">
        Admin Dashboard
      </h2>

      {/* -- Totals Section -- */}
      {totals && (
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <div className="bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-blue-200 flex-1 min-w-[180px] text-center p-6">
            <p className="text-base font-semibold text-blue-800 mb-2">
              Total Users
            </p>
            <p className="text-5xl font-extrabold text-blue-800">
              {totals.total_users}
            </p>
          </div>
          <div className="bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-pink-200 flex-1 min-w-[180px] text-center p-6">
            <p className="text-base font-semibold text-pink-700 mb-2">
              Total Stores
            </p>
            <p className="text-5xl font-extrabold text-pink-700">
              {totals.total_stores}
            </p>
          </div>
          <div className="bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-purple-300 flex-1 min-w-[180px] text-center p-6">
            <p className="text-base font-semibold text-purple-700 mb-2">
              Total Ratings
            </p>
            <p className="text-5xl font-extrabold text-purple-700">
              {totals.total_ratings}
            </p>
          </div>
        </div>
      )}

      {/* -- Forms Section - Matching Height -- */}
      <div className="flex flex-col md:flex-row gap-8 mb-12 h-full">
        {/* User Form */}
        <div className="bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-blue-200 flex-1 p-8 flex flex-col h-full">
          <h3 className="text-2xl font-bold text-blue-800 mb-8 text-center">
            Create User
          </h3>
          <form
            onSubmit={createUser}
            className="flex flex-col gap-4 flex-1 h-full justify-between"
          >
            <input
              name="name"
              value={newUser.name}
              onChange={handleUserChange}
              placeholder="Full Name"
              required
              className="block w-full px-4 py-3 rounded-xl border-2 border-blue-200 bg-white/70 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-500 transition"
            />
            <input
              name="email"
              value={newUser.email}
              onChange={handleUserChange}
              placeholder="Email Address"
              required
              className="block w-full px-4 py-3 rounded-xl border-2 border-blue-200 bg-white/70 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-500 transition"
            />
            <input
              name="address"
              value={newUser.address}
              onChange={handleUserChange}
              placeholder="Your Address"
              required
              className="block w-full px-4 py-3 rounded-xl border-2 border-blue-200 bg-white/70 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-500 transition"
            />
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleUserChange}
              placeholder="Password"
              required
              className="block w-full px-4 py-3 rounded-xl border-2 border-blue-200 bg-white/70 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-500 transition"
            />
            <select
              name="role"
              value={newUser.role}
              onChange={handleUserChange}
              className="block w-full px-4 py-3 rounded-xl border-2 border-blue-200 bg-white/70 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            >
              <option value="normal">Normal</option>
              <option value="store_owner">Store Owner</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              disabled={creatingUser}
              className={`w-full py-3 rounded-xl bg-gradient-to-r from-blue-400 via-pink-400 to-purple-400 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all flex items-center justify-center ${
                creatingUser ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {creatingUser ? (
                <>
                  <svg
                    className="animate-spin mr-2 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </button>
          </form>
        </div>

        {/* Store Form */}
        <div className="bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-pink-200 flex-1 p-8 flex flex-col h-full">
          <h3 className="text-2xl font-bold text-pink-700 mb-8 text-center">
            Create Store
          </h3>
          <form
            onSubmit={createStore}
            className="flex flex-col gap-4 flex-1 h-full justify-between"
          >
            <input
              name="name"
              value={newStore.name}
              onChange={handleStoreChange}
              placeholder="Store Name"
              required
              className="block w-full px-4 py-3 rounded-xl border-2 border-pink-200 bg-white/70 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 placeholder-gray-500 transition"
            />
            <input
              name="email"
              value={newStore.email}
              onChange={handleStoreChange}
              placeholder="Store Email"
              required
              className="block w-full px-4 py-3 rounded-xl border-2 border-pink-200 bg-white/70 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 placeholder-gray-500 transition"
            />
            <input
              name="address"
              value={newStore.address}
              onChange={handleStoreChange}
              placeholder="Store Address"
              required
              className="block w-full px-4 py-3 rounded-xl border-2 border-pink-200 bg-white/70 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 placeholder-gray-500 transition"
            />
            <select
              name="owner_id"
              value={newStore.owner_id ?? ""}
              onChange={(e) =>
                setNewStore({ ...newStore, owner_id: Number(e.target.value) })
              }
              required
              className="block w-full px-4 py-3 rounded-xl border-2 border-pink-200 bg-white/70 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
            >
              <option value="">Select Store Owner</option>
              {storeOwners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={creatingStore}
              className={`w-full py-3 rounded-xl bg-gradient-to-r from-pink-400 via-blue-400 to-purple-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:from-pink-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all flex items-center justify-center ${
                creatingStore ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {creatingStore ? (
                <>
                  <svg
                    className="animate-spin mr-2 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Store"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* -- User Search Bar -- */}
      <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-blue-200 shadow-md flex flex-wrap gap-4 items-center p-6 mb-8">
        <input
          type="text"
          placeholder="Search users..."
          onChange={(e) => setUserSearch(e.target.value)}
          className="block flex-1 min-w-[120px] px-4 py-2 rounded-xl border-2 border-blue-200 bg-white/70 text-base shadow focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-500"
        />
        <select
          onChange={(e) => setUserSortBy(e.target.value)}
          className="block min-w-[120px] px-4 py-2 rounded-xl border-2 border-blue-200 bg-white/70 shadow focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="created_at">Created At</option>
        </select>
        <select
          onChange={(e) => setUserOrder(e.target.value)}
          className="block min-w-[120px] px-4 py-2 rounded-xl border-2 border-blue-200 bg-white/70 shadow focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <button
          onClick={fetchUsers}
          disabled={usersApplying}
          className={`py-2 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition flex items-center justify-center ${
            usersApplying ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {usersApplying ? (
            <>
              <svg
                className="animate-spin mr-2 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Applying...
            </>
          ) : (
            "Apply"
          )}
        </button>
      </div>

      {/* -- User List -- */}
      <h3 className="text-lg font-semibold mb-3 text-blue-800">All Users</h3>
      <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-blue-200 shadow mb-10 overflow-x-auto max-w-full">
        <div className="overflow-y-auto max-h-[320px]">
          <table className="min-w-[650px] sm:min-w-full rounded-xl table-auto text-left text-sm bg-transparent">
            <thead>
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) &&
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/50 transition">
                    <td className="py-2 px-4">{u.name}</td>
                    <td className="py-2 px-4">{u.email}</td>
                    <td className="py-2 px-4">{u.address}</td>
                    <td className="py-2 px-4">{u.role}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => deleteUser(u.id)}
                        disabled={loadingUserId === u.id}
                        className={`py-1 px-4 rounded-xl bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold shadow hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-300 transition flex items-center justify-center ${
                          loadingUserId === u.id
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {loadingUserId === u.id ? (
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 ..."
                            />
                          </svg>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* -- Store List Search Bar -- */}
      <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-pink-200 shadow-md flex flex-wrap gap-4 items-center p-6 mb-8">
        <input
          type="text"
          placeholder="Search stores..."
          onChange={(e) => setSearch(e.target.value)}
          className="block flex-1 min-w-[120px] px-4 py-2 rounded-xl border-2 border-pink-200 bg-white/70 text-base shadow focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition placeholder-gray-500"
        />
        <select
          onChange={(e) => setSortBy(e.target.value)}
          className="block min-w-[120px] px-4 py-2 rounded-xl border-2 border-pink-200 bg-white/70 shadow focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="created_at">Created At</option>
        </select>
        <select
          onChange={(e) => setOrder(e.target.value)}
          className="block min-w-[120px] px-4 py-2 rounded-xl border-2 border-pink-200 bg-white/70 shadow focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <button
          onClick={fetchStores}
          disabled={storesApplying}
          className={`py-2 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition flex items-center justify-center ${
            usersApplying ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {storesApplying ? (
            <>
              <svg
                className="animate-spin mr-2 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Applying...
            </>
          ) : (
            "Apply"
          )}
        </button>
      </div>

      {/* -- Store List -- */}
      <h3 className="text-lg font-semibold mb-3 text-pink-700">All Stores</h3>
      <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-pink-200 shadow mb-10 overflow-x-auto max-w-full">
        <div className="overflow-y-auto max-h-[320px]">
          <table className="min-w-[650px] sm:min-w-full rounded-xl table-auto text-left text-sm bg-transparent">
            <thead>
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(stores) &&
                stores.map((s) => (
                  <tr key={s.id} className="hover:bg-white/50 transition">
                    <td className="py-2 px-4">{s.name}</td>
                    <td className="py-2 px-4">{s.email}</td>
                    <td className="py-2 px-4">{s.address}</td>
                    <td className="py-2 px-4 flex items-center gap-1">
                      {Number(s.avg_rating).toFixed(1)}
                      <FaStar style={{ color: "#FFD700" }} />
                    </td>
                    <td className="py-2 px-4">
                      <button
                        // onClick={async () => {
                        //   if (window.confirm("Delete this store?")) {
                        //     const res = await fetch(
                        //       `${apiUrl}/api/stores/${s.id}`,
                        //       { method: "DELETE", credentials: "include" }
                        //     );
                        //     if (res.ok) {
                        //       toast.success("Store Deleted");
                        //       fetchStores();
                        //     } else {
                        //       toast.error(
                        //         "OOPs, there is a relation of this user with a store, hence can't delete for now. Please Try with a normal user. I (developer) will handle this issue later",
                        //         { autoClose: 3000 }
                        //       );
                        //     }
                        //   }
                        // }
                        // }
                        onClick={() => deleteStore(s.id)}
                        disabled={loadingStoreId === s.id}
                        className={`py-1 px-4 rounded-xl bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold shadow hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-300 transition flex items-center justify-center ${
                          loadingStoreId === s.id
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {loadingStoreId === s.id ? (
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373..."
                            />
                          </svg>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

}