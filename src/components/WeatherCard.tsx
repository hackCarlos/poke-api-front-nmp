import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'antd';
import { Weather, WeatherProps } from '../interfaces/Weather';
import { REACT_APP_OPEN_WATER_API_KEY, REACT_APP_OPEN_WATER_API_URL } from '../config/config';


const Weathers: React.FC<WeatherProps> = ({ location }) => {
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
        const [lattitude, longitude] = location.split(',')
        try{
            
        const response = await axios.get(REACT_APP_OPEN_WATER_API_URL, {
        params: {
          lat: lattitude,
          lon: longitude.replace(' ', ''),
          units: 'metric',
          appid: REACT_APP_OPEN_WATER_API_KEY
        }
    });
    setWeather(response.data );  
    } catch(error){
        console.log(error)
    }
    };

    fetchWeather();
  }, [location]);

  if (!weather) return <div>Cargando...</div>;

  return (
    <Card title={`Clima en: ${weather.city.name}`}>
      <p>Temperatura mínima: {weather.list[2].main.temp_min} °C</p>
      <p>Temperatura: máxima: {weather.list[2].main.temp_max} °C</p>
      <p>Humedad: {weather.list[2].main.humidity} %</p>
      <p>Descripción: {weather.list[2].weather[0].description}</p>
    </Card>
  );
};

export default Weathers;