import { useState,useEffect } from 'react'
import './App.css'
import axios from 'axios'
import { useSpring, animated, useTransition } from '@react-spring/web'

function App() {
  const [clima,setClima] = useState([]);
  const [tempUnit,setTempUnit] = useState(0);
  const [clickedButton, setClickedButton] = useState(false)
  const apikey = '56e1337974ab22108e31121b83bc55f2';

  useEffect(() => {
    location()
  },[])

  const location = async () => {
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("dentro de if")
      let nPositionLatitude = position.coords.latitude;
      let nPositionLongitude = position.coords.longitude;
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${nPositionLatitude}&lon=${nPositionLongitude}&appid=${apikey}`).then(resp => {
        setClima(resp.data);
        setTempUnit(Math.floor(resp.data.main.temp - 273.15) + '°C');
      })
    }, (error) => {
      alert(error.message)
    })
  }else {
    alert("Not supported")
  }
}

const faren = () => {
  setClickedButton(!clickedButton);
  setTempUnit(clickedButton ? Math.floor(clima.main.temp - 273.15)+ '°C': Math.floor(clima.main.temp-273.15)* 9/5 + 32 + "°F")
}

  return (
    <div className='app'>
    {clima && Object.keys(clima).length > 0 &&(
      <div>
        <div>
          {console.log(clima)}
          <h2>{clima.name},{clima.sys.country}</h2>
          <p>{clima.weather[0].description}</p>
          <p>Wind Speed {clima.wind.speed}</p>
          <p>Clouds {clima.clouds.all}%</p>
          <p>Pressure: {clima.main.pressure}Pa</p>
          <p>Temperature: {tempUnit}</p>
          <button onClick={faren}>Change to: {`${clickedButton ? '°C' : '°F'}`}</button>
        </div>
        <div>
        </div>
      </div>
    )}
    </div>
  )}

export default App
