import { useQuery } from "@tanstack/react-query";
import { api } from "./AuthAPI";

// Fetch Weather Update
export const useWeatherUpdate = () => {
  return useQuery({
    queryKey: ["weatherUpdate"],
    queryFn: async () => {
      const response = await api.get("WeatherForecast");
      return response.data;
    },
  });
};
