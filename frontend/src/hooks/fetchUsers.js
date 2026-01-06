import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api/axios";

export default function useAdminList({ endpoint, limit = 10 }) {
  const { accessToken } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!accessToken) return; 
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(endpoint, {
          params: { search, page, limit },
        });
        setData(res.data.data);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error("Admin fetch failed", err);
        setData([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, search, page, limit, accessToken]);

  return {data,pagination,loading,search,setSearch,page,setPage,};
}
