import { useState,useEffect } from 'react'
import './App.css'
import axios from 'axios'
import { useSpring, animated, useTransition } from '@react-spring/web'

function App() {
  const [clima,setClima] = useState([]);
  const [items,setItems] = useState([]);

  // const [cuadro,setCuadro] = useState([]);

  const transition = useTransition(items,{
    from:{x: -100, y:800, opacity:0, width:10, height:10},
    enter: item => async(next) => {
      await next({ y: item.y, opacity:1, delay: item.delay});
      await next({ x:0, width:100, height:100});
    },
    leave:{x: 100, y:800, opacity:0}
  });

  // Si no se pone width y height los cuadros no aparecen, aunque el tamaño sea 0, igualmente debe de estar
  // const transition2 = useTransition(cuadro, {
  //   from:{x: -1000, y:0, opacity:0, width:10, height:10, color:'#000'},
  //   enter: cuadro => async(next) => {
  //     await next({y: cuadro.y, opacity:1, delay: cuadro.delay});
  //     await next({x:0, width:100, height:100, color:'#fff'});
  //   },
  //   leave:{x:1000, y:0, opacity:0}
  // });

  const apikey = '56e1337974ab22108e31121b83bc55f2';

//   useEffect(() => {axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=12.1346&lon=-86.2469&appid=${apikey}`).then(resp => {
//     console.log('Dentro de useEffect: ',resp.data)
//     setClima([resp.data.coord])
// })},[])

const location = () => {
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("dentro de if")
      let nPositionLatitude = position.coords.latitude;
      let nPositionLongitude = position.coords.longitude;
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${nPositionLatitude}&lon=${nPositionLongitude}&appid=${apikey}`).then(resp => {
        console.log("resp: ",resp.data.weather[0].description)
        setClima(resp.data);
      })
    }, (error) => {
      alert(error.message)
    })
  }else {
    alert("Not supported")
  }
}

useEffect(() => {
})
// const [springs, api] = useSpring(() => ({
//   from: { x: 0 }
// }))

// const handleClick = () => {
//   api.start({
//     from: {
//       x:0.
//     },
//     to: {
//       x:100.
//     },
//     leave:{
//       y:200
//     }
//   })
// }


  const cod = () => {
    return clima.map((obj) => (
      <animated.div key={obj} >
        <p>lat: {obj}</p>
      </animated.div>
    ))
  }

  return (
    <div className='app'>
    {/* Cuadros   */}
    <button onClick={() => {setItems(v => v.length ? [] : [
      {y: -100, delay:200},
      {y: -50, delay: 400},
      {y: 0, delay:600}
    ]);
    }}>
      {items.length ? 'Salir' : 'Entrar'}
    </button>
    <div className='container'>
      {transition((style,item) => item ? <animated.div style={style} className='item'/> : '')}
    </div>


    <button onClick={location}>Share location</button>
    {clima && (
      <div>
        <div>
          <h2>{clima.name}</h2>
          <p>{clima && clima.weather ? clima.weather[0].description : 'Presiona el boton para mostrar informacion'}</p>
        </div>
        <div>
        </div>
      </div>
    )}
    {/* Fin Cuadros  */}
      {/* {clima.map((item) => (
        <div key={item}>
          <p>lat: {item.lat}</p>
        </div>
      ))
      } */}
      

    {/*  Cuadro  */}
    {/* Creando logica para cuando clickee el boton que muestre el cuadro o cuadros */}
    {/*
    <button onClick={() => {setCuadro(det => det.length ? [] : [
      {y: -100, delay:100},
    ]);
    }}>{cuadro.length ? 'Ocultar' : 'Mostrar'}</button>
    <div className='container2'>
      {transition2((style,cuadro) => cuadro ? (
        <animated.div style={style} className='item2'> {clima[0].lon}</animated.div>
      ): '')}
    </div>

  */}

        {/*  Animacion de cuadro */}


      {/* <animated.div
      onClick={handleClick}
      style={{
        width: 80,
        height: 80,
        background: '#ff6d6d',
        borderRadius: 8,
        ...springs
      }}

      /> */}
      {/* Fin Cuadro */}
    </div>

  )}

export default App
