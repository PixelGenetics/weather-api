    import React, { useState, useEffect, useRef } from 'react';
    import axios from 'axios';
    import { useTransition, animated } from '@react-spring/web';
    import '../Components/styleComponents/StyleCard.css';

    const Card = () => {
    const [clima, setClima] = useState({});
    const [tempUnit, setTempUnit] = useState('0°C');
    const [clickedButton, setClickedButton] = useState(false);
    const [loading, setLoading] = useState(true);
    const [weatherCap, setWeatherCap] = useState('');
    const [textInput, setTextInput] = useState('');
    const [finder, setFinder] = useState({});
    const [showResults, setShowResults] = useState(false);
    const apikey = '56e1337974ab22108e31121b83bc55f2';

    useEffect(() => {
        location();
    }, []);

    const location = async () => {
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
            let nPositionLatitude = position.coords.latitude;
            let nPositionLongitude = position.coords.longitude;
            axios
                .get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${nPositionLatitude}&lon=${nPositionLongitude}&appid=${apikey}`
                )
                .then((resp) => {
                setClima(resp.data);
                updateTemperature(resp.data.main.temp, resp.data.weather?.[0]?.description);
                })
                .catch((error) => {
                alert(error.message);
                })
                .finally(() => {
                setLoading(false);
                setShowResults(true);
                });
            },
            () => {
            alert('Error getting location');
            setLoading(false);
            }
        );
        } else {
        alert('Not supported');
        }
    };

    const faren = () => {
        setClickedButton(!clickedButton);
        const temperatureToConvert = finder.main?.temp || clima.main?.temp || 0;
        const descriptionToUse =
        finder.weather?.[0]?.description || clima.weather?.[0]?.description || '';
        updateTemperature(temperatureToConvert, descriptionToUse);
    };

    const updateTemperature = (temperature, description) => {
        if (clickedButton) {
        setTempUnit(`${Math.floor((temperature - 273.15) * (9 / 5) + 32)}°F`);
        } else {
        setTempUnit(`${Math.floor(temperature - 273.15)}°C`);
        }

        setWeatherCap(
        description ? description.charAt(0).toUpperCase() + description.slice(1) : ''
        );
    };

    const city = useRef();

    const handleForm = (event) => {
        event.preventDefault();
        setTextInput(city.current.value.toLowerCase().trim());
    };

    useEffect(() => {
        if (textInput) {
        setLoading(true); // Se establece en true antes de hacer la nueva solicitud
        setShowResults(false); // Se establece en false para ocultar los resultados mientras se carga la nueva información
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${textInput}&appid=${apikey}`)
            .then((resp) => {
            setFinder(resp.data);
            updateTemperature(resp.data.main.temp, resp.data.weather?.[0]?.description);
            })
            .catch((error) => {
            console.log(error);
            })
            .finally(() => {
            setLoading(false);
            setShowResults(true);
            });
        }
    }, [textInput]);

    const transitions = useTransition(showResults, {
        from: { opacity: 0, transform: 'translateY(-20px)' },
        enter: { opacity: 1, transform: 'translateY(0)' },
        leave: { opacity: 0, transform: 'translateY(-20px)' },
    });

    return (
        <div className="app">
        <h1>Weather App</h1>
        <form className="weatherForm" onSubmit={handleForm}>
            <input type="text" ref={city} />
            <button type="submit">Search</button>
        </form>
        {transitions(
            (style, item) =>
            item && (
                <animated.div style={style}>
                <div>
                    <h2>{finder?.name || clima?.name},{finder?.sys?.country || clima?.sys?.country}</h2>
                    <p>{weatherCap}</p>
                    <p>Wind Speed: {finder?.wind?.speed || clima?.wind?.speed}m/s</p>
                    <p>Clouds: {finder?.clouds?.all || clima?.clouds?.all}%</p>
                    <p>Pressure: {finder?.main?.pressure || clima?.main?.pressure}Pa</p>
                    <p>Temperature: {tempUnit}</p>
                    <button onClick={faren}>Change to: {`${clickedButton ? '°C' : '°F'}`}</button>
                </div>
                </animated.div>
            )
        )}
        {loading && <img src='https://i.gifer.com/ZKZg.gif' alt="" />}
        </div>
    );
    };

    export default Card;
