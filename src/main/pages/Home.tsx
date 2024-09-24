import { useEffect } from "react";
import { useWeatherUpdate } from "../../lib/API/WeatherAPI";
import { validateToken } from "../../lib/API/TokenValidation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../../state/authSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const { data: weatherData, isLoading, error } = useWeatherUpdate();
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(()=>{
    if(user ===null){
      navigate("/")
    }
  })

  useEffect(() => {
    const validateAndSetUser = async () => {
      const isValidToken = await validateToken();
      if (isValidToken) {
        const accessToken = Cookies.get("accessToken");

        if (!accessToken) return;

        const decoded: any = jwtDecode(accessToken);
        const user = {
          userId:
            decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ],
          email:
            decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
            ],
          userName:
            decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ],
          userRole:
            decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ],
        };
        dispatch(setUser(user));
      }
    };
    validateAndSetUser();
  }, [dispatch]);
  
  if (isLoading) return <p>Loading weather data...</p>;
  if (error) return <p>Error loading weather data: {error.message}</p>;

  return (
    <div>
      <h2>Weather Update</h2>
      <p>{user.userId}</p>
      <p>{user.email}</p>
      <p>{user.userName}</p>
      <p>{user.userRole}</p>
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
