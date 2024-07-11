import React from 'react';
import { useWeatherUpdate } from '../../lib/API/WeatherAPI';

const Home = () => {
  const { data: weatherData, isLoading, error } = useWeatherUpdate();

  if (isLoading) return <p>Loading weather data...</p>;
  if (error) return <p>Error loading weather data: {error.message}</p>;

  return (
    <div>
      <h2>Weather Update</h2>
      {weatherData && (
        <div>
          {weatherData.map((weather: any, index: any) => (
            <div key={index} className="m-3">
              <p>Date: {weather.date}</p>
              <p>
                Temperature: {weather.temperatureC}°C / {weather.temperatureF}°F
              </p>
              <p>Summary: {weather.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
