import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { useNotifications } from "../../hooks/useNotifications";
import { FaCheck, FaCheckDouble } from "react-icons/fa";


export default function UserNotifications({ isOpen, onClose }) {
  
  const { data: notifications = [],isLoading} = useNotifications();
  
  const queryClient=useQueryClient();

  if (!isOpen) return null;

  const markOne = async (id) => {
    queryClient.setQueryData(["notifications"],(old=[])=>
    old.map((n)=>n._id === id ? {...n,isRead:true}:n)
  )
  await api.patch(`/user/notifications/${id}/read`);
  };

  const markAll = async (id) => {
    queryClient.setQueryData(["notifications"],(old=[])=>
    old.map((n)=>({...n,isRead:true})))
    await api.patch("/user/notifications/read-all");
  };

  
  const unreadNotifications = notifications.filter(
    (n) => !n.isRead
  );

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/30 z-40" />

      <div className="fixed top-16 right-4 z-50 w-80 bg-white rounded-xl shadow-2xl flex flex-col">
        
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="text-sm font-semibold">Notifications</h3>

          <div className="flex gap-2">
            {unreadNotifications.length > 0 && (
              <button onClick={markAll} title="Mark all as read" className="text-green-600 text-sm">
                <FaCheckDouble size={14} />
              </button>
            )}
            <button onClick={onClose} className="text-sm">✖</button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {isLoading && ( <p className="text-center py-6 text-sm">Loading...</p> )}

          {!isLoading && unreadNotifications.length === 0 && (
            <p className="text-center py-6 text-sm text-gray-500">
              No Notifications
            </p>
          )}

          {unreadNotifications.map((n) => (
            <div key={n._id} className="px-4 py-3 border-b flex gap-3 hover:bg-gray-50" >
              <div className="flex-1">
                <h4 className="text-sm font-medium">{n.title}</h4>
                <p className="text-xs text-gray-600">
                  {n.message}
                </p>
                <small className="text-[10px] text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </small>
              </div>

              <button onClick={() => markOne(n._id)} title="Mark as read" >
                <FaCheck size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
