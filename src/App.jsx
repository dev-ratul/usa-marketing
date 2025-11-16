import { useState } from "react";
import useAxios from "./hooks/useAxios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "./pages/loading/Loading";

function App() {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page],
    queryFn: async () => {
      const res = await axiosInstance.get(`/all-users-collection?page=${page}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  const lockMutation = useMutation({
    mutationFn: async (id) => axiosInstance.patch(`/lock-user/${id}`),
  });

  if (isLoading) return <Loading />;

  const { users, totalPages, totalUsers, totalCopied, todayCopied } = data;

  const activeCount = users.filter(u => !u.locked).length;

  const handleCopy = async (user) => {
    if (user.locked) return;

    const text = `
Full Name: ${user.fullName}
First Name: ${user.firstName}
Last Name: ${user.lastName}
City: ${user.city}
    `.trim();

    await navigator.clipboard.writeText(text);

    lockMutation.mutate(user._id, {
      onSuccess: () => {
        queryClient.setQueryData(["users", page], oldData => ({
          ...oldData,
          users: oldData.users.map(u =>
            u._id === user._id ? { ...u, locked: true, lockedAt: new Date() } : u
          ),
          todayCopied: oldData.todayCopied + 1,
          totalCopied: oldData.totalCopied + 1
        }))
      }
    });
  };

  const hoursLeftToday = 24 - new Date().getHours();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-4 flex flex-col lg:flex-row gap-6 select-none">
      
      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-white shadow-lg flex-shrink-0">
        <h2 className="text-2xl font-extrabold mb-4 flex items-center gap-2">📊 Stats</h2>
        <div className="space-y-2 text-sm sm:text-base">
          <p>Total Users: <span className="text-green-400 font-semibold">{totalUsers}</span></p>
          <p>Active this Page: <span className="text-yellow-300 font-semibold">{activeCount}</span></p>
          <p>Today Copied: <span className="text-blue-400 font-semibold">{todayCopied}</span></p>
          <p>Total Copied: <span className="text-red-400 font-semibold">{totalCopied}</span></p>
          <p>Hours Left Today: <span className="text-purple-400 font-semibold">{hoursLeftToday}</span></p>
          <p>Page: <span className="text-green-300 font-semibold">{page} / {totalPages}</span></p>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 overflow-x-auto shadow-lg">
        <h1 className="text-3xl sm:text-4xl text-white font-extrabold text-center mb-6">🧾 Premium User Directory</h1>
        <table className="min-w-full text-white text-xs sm:text-sm md:text-base">
          <thead className="bg-white/20 text-gray-200 uppercase text-[10px] sm:text-xs md:text-sm sticky top-0 backdrop-blur-md">
            <tr>
              <th className="px-4 py-2 text-left">Full Name</th>
              <th className="px-4 py-2 text-left">First</th>
              <th className="px-4 py-2 text-left">Last</th>
              <th className="px-4 py-2 text-left">City</th>
              <th className="px-4 py-2 text-center">Copy</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className={`transition-all ${u.locked ? "blur-[5px] text-gray-400 cursor-not-allowed" : "hover:bg-white/20"} border-b border-white/20`}>
                <td className="px-4 py-2">{u.fullName}</td>
                <td className="px-4 py-2">{u.firstName}</td>
                <td className="px-4 py-2">{u.lastName}</td>
                <td className="px-4 py-2">{u.city}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleCopy(u)}
                    disabled={u.locked}
                    className={`transition-all duration-300 px-2 py-1 rounded-md font-semibold ${u.locked ? "bg-gray-600 text-gray-300 cursor-not-allowed" : "bg-green-500 cursor-pointer  hover:bg-green-400 text-white"}`}
                  >
                    {u.locked ? "🔒" : "📋"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex flex-wrap justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 rounded-lg text-sm sm:text-base font-medium transition-all ${page === num ? "bg-green-500 text-white  shadow-lg" : "bg-white/20 cursor-pointer text-gray-200 hover:bg-white/30"}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
