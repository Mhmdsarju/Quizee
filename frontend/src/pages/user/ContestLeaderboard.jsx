import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trophy, Medal, ArrowLeft, Download, Mail, Loader2, Crown,History,PartyPopper} from "lucide-react";
import Swal from "sweetalert2";
import { getContestStatus, getLeaderboard, getMyResult, sendCertificate } from "../../api/contestApi";


export default function ContestLeaderboard() {
  const { contestId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [contestStatus, setContestStatus] = useState(null);
  const [myResult, setMyResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setLoading(true);
    getContestStatus(contestId)
      .then((res) => {
        setContestStatus(res.data.status);
        if (res.data.status === "COMPLETED") {
          Promise.all([
            getLeaderboard(contestId),
            getMyResult(contestId).catch(() => ({ data: null }))
          ]).then(([lbRes, myRes]) => {
            setData(lbRes.data || []);
            setMyResult(myRes.data);
          });
        }
      })
      .finally(() => setLoading(false));
  }, [contestId]);

  const { topThree, others } = useMemo(() => {
    const sorted = [...data].sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999));
    return {
      topThree: sorted.filter((d) => d.rank <= 3),
      others: sorted.filter((d) => d.rank > 3),
    };
  }, [data]);

  const sendCertificateToEmail = async () => {
    try {
      setSending(true);
      Swal.fire({
        title: "Sending...",
        text: "Delivering your achievement to your inbox",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await sendCertificate(myResult.certificateUrl);;

      Swal.fire({
        icon: "success",
        title: "Sent!",
        text: "Certificate sent successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: "Could not send email. Please try again." });
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
      <p className="text-gray-500 font-medium tracking-wide">Calculating Final Ranks...</p>
    </div>
  );

  return (
    <div className="min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
  
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate("/user/contest")}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
            <Trophy size={18} className="fill-indigo-600" />
            <span className="text-xs font-black uppercase tracking-widest">Hall of Fame</span>
          </div>
        </div>

        {contestStatus !== "COMPLETED" ? (
          <div className=" rounded-3xl shadow-xl shadow-gray-200/50 p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <History className="text-amber-500 animate-spin-slow" size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Results are brewing!</h2>
            <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
              We're still tallying the scores. Check back in a few minutes to see the winners.
            </p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 font-medium">No participation data found for this contest.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center items-end gap-2 sm:gap-6 mb-16 mt-8 overflow-x-auto pb-4 pt-10">
              <PodiumItem user={topThree.find(u => u.rank === 2)} rank={2} color="text-slate-400" bgColor="bg-slate-200" height="h-28 sm:h-36" />
              <PodiumItem user={topThree.find(u => u.rank === 1)} rank={1} color="text-yellow-500" bgColor="bg-yellow-400" height="h-36 sm:h-48" isWinner />
              <PodiumItem user={topThree.find(u => u.rank === 3)} rank={3} color="text-amber-700" bgColor="bg-amber-600" height="h-24 sm:h-28" />
            </div>

            {myResult && myResult.rank <= 3 && (
              <div className="relative bg-blue-quiz rounded-3xl p-8 mb-12 text-white shadow-2xl shadow-xxl overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                    <PartyPopper size={120} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-black mb-1">Phenomenal Performance!</h2>
                    <p className="text-blue-100 text-sm">You've secured Rank <span className="font-bold text-white">#{myResult.rank}</span> and earned <span className="text-yellow-300 font-bold">₹{myResult.rewardAmount}</span></p>
                  </div>
                  
                  <div className="flex gap-3">
                    <a
                      href={`${import.meta.env.VITE_API_URL}${myResult.certificateUrl}`}
                      target="_blank"
                      className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition shadow-lg"
                    >
                      <Download size={18} /> Certificate
                    </a>
                    <button
                      onClick={sendCertificateToEmail}
                      disabled={sending}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:bg-indigo-400 transition border border-indigo-400"
                    >
                      <Mail size={18} /> {sending ? "Sending..." : "Email Me"}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rest of the field</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Points</span>
                </div>
              <div className="divide-y divide-gray-50">
                {others.map((row) => (
                  <div key={row._id} className="flex justify-between items-center px-6 py-4 hover:bg-indigo-50/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="w-8 text-sm font-bold text-gray-300">#{row.rank}</span>
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                         {row.userId?.name?.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-700">{row.userId?.name}</span>
                    </div>
                    <span className="font-mono font-bold text-indigo-600">{row.score} <span className="text-[10px] text-gray-400">pts</span></span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PodiumItem({ user, rank, color, bgColor, height, isWinner }) {
  if (!user) return <div className="w-24 sm:w-32" />;

  return (
    <div className={`flex flex-col items-center w-24 sm:w-32 transition-transform duration-700 ease-out animate-slide-up`}>
      <div className="relative mb-4">
        {isWinner && <Crown className="absolute -top-7 left-1/2 -translate-x-1/2 text-yellow-500 animate-bounce" size={28} fill="#eab308" />}
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 ${isWinner ? 'border-yellow-400' : 'border-white shadow-md'} overflow-hidden bg-white flex items-center justify-center text-xl font-black text-gray-400`}>
           {user.userId?.name?.charAt(0)}
        </div>
        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${bgColor} flex items-center justify-center text-[10px] font-black text-white border-2 border-white`}>
            {rank}
        </div>
      </div>

      <p className={`text-xs sm:text-sm font-black mb-1 text-center truncate w-full ${isWinner ? 'text-gray-900' : 'text-gray-500'}`}>
        {user.userId?.name}
      </p>
      
      <div className={`w-full ${height} ${bgColor} rounded-t-2xl flex flex-col items-center justify-start pt-4 shadow-lg transition-all`}>
        <span className="text-3xl sm:text-5xl font-black text-white/40">{rank}</span>
        <div className="mt-auto mb-4 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
            <span className="text-[10px] font-bold text-black whitespace-nowrap">{user.score} pts</span>
        </div>
      </div>
    </div>
  );
}