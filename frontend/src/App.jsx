import './App.css'
import Signup from "./components/Signup"
import Login from './components/Login'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { MainLayout } from './components/MainLayout'
import Home from './components/Home'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import { io } from 'socket.io-client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/rtnSlice';
import ProtectedRoutes from './components/ProtectedRoutes'

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/login' />
  },
  {
    path: '/home',
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: '/home',
        element: <ProtectedRoutes><Home /></ProtectedRoutes>
      },
      {
        path: '/home/profile/:id',
        element: <ProtectedRoutes><Profile /></ProtectedRoutes>
      },
      {
        path: '/home/account/edit',
        element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
      },
      {
        path: '/home/chat',
        element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>
      },
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  }
])

function App() {
  const { user } = useSelector(store => store.auth);
  const {socket} = useSelector(store => store.socketio)
  const dispatch = useDispatch()
  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:5000', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      //listning all the events 
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers))
      });

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      })

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if(socket) {
      socket.close();
      dispatch(setSocket(null));
    }

  }, [user, dispatch])

  return (
    <div className='bg-zinc-950 text-white'>
      <RouterProvider router={browserRouter} />
    </div>
  )
}

export default App




{/*   
  
  1. first a react-router-dom install kore nite hobe, tarpor app.jsx code a ---

  2. first a createBrowserRouter r routerProvider import kore nite hobe, react-router-dom theke 
     tarpor routeing setup korte hobe,

  3. const browserRouter = createBrowserRouter([
     
     tarpor erokom vabe browserRouter create korte hobe, jar vetore acta array er vetore 
     object thakbe, protita route acta object er vetore create korte hobe, r object er vetore 
     path:'/home' r element: a component define korte hoeb...main layout er vetore amra jei 
     component gulo dekhate chai segula children array er vetore rakhbo, 

  4. tarpor app.jsx a <routerProvider/> render korte hobe, er vetore router={browserRouter} define
     korte hobe. <RouterProvider router={browserRouter}/> browserRouter sei variable jar vetore 
     routes gulo define kora hoyeche. 
  
  5. children component render korar jonno, mainLayout component a <Outlet/> likhte hobe, er fole 
     jei component gulo route a define kora ache segulo tar roue er onujai render hobe, 
     r jei component take amra fixed rakhte chai, setake <Outlet/> div er baire define korbo, 
     amra mainLayout k sob somoy render korbo, tarpor tar sathe home, profile egulo render hobe
     r leftside bar MainLayout er sathe fixed thakbe jeta sob somoy render hobe. 

  
  
  
  
  */}