import { useState,useEffect } from 'react'
import './App.css'
import axios from 'axios'
import { useSpring, animated, useTransition } from '@react-spring/web'

function App() {
  const [clima,setClima] = useState([]);
  const [items,setItems] = useState([]);

  const [cuadro,setCuadro] = useState([]);

  const transition = useTransition(items,{
    from:{x: -100, y:800, opacity:0, width:10, height:10},
    enter: item => async(next) => {
      await next({ y: item.y, opacity:1, delay: item.delay});
      await next({ x:0, width:100, height:100});
    },
    leave:{x: 100, y:800, opacity:0}
  });

  // Si no se pone width y height los cuadros no aparecen, aunque el tamaño sea 0, igualmente debe de estar
  const transition2 = useTransition(cuadro, {
    from:{x: -200, y:400, opacity:0, width:10, height:10, color:'#000'},
    enter: cuadro => async(next) => {
      await next({y: cuadro.y, opacity:1, delay: cuadro.delay});
      await next({x:0, width:100, height:100, color:'#fff'});
    },
    leave:{x:100, y:800, opacity:0}
  });



  useEffect(() => {axios.get('https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=56e1337974ab22108e31121b83bc55f2').then(resp => {
    console.log('Dentro de useEffect: ',resp.data.coord)
    setClima([resp.data.coord])
})},[])


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
        <p>lat: {obj.lat}</p>
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

    {/* Fin Cuadros  */}
      {/* {clima.map((item) => (
        <div key={item}>
          <p>lat: {item.lat}</p>
        </div>
      ))
      } */}
      
      {
        cod()
      }



    {/*  Cuadro  */}
    {/* Creando logica para cuando clickee el boton que muestre el cuadro o cuadros */}
    <button onClick={() => {setCuadro(det => det.length ? [] : [
      {y: -100, delay:100},
      {y: -50, delay: 200}
    ]);
    }}>{cuadro.length ? 'Ocultar' : 'Mostrar'}</button>
    <div className='container2'>
      {transition2((style,cuadro) => cuadro ? (
        <animated.div style={style} className='item2'> {clima[0].lon}</animated.div>
      ): '')}
    </div>



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
