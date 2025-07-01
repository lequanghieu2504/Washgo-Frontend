import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchCarwashes = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const response = await fetch(`${apiUrl}/api/carwashes`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

export function useCarwash() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["carwashes"],
    queryFn: async () => {
      const data = await fetchCarwashes();
      if (Array.isArray(data)) {
        data.forEach((carwash) => {
          queryClient.setQueryData(["carwash", carwash.id], carwash);
        });
      }
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
