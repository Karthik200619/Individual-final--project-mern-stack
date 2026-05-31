import React from 'react'
import Login from './components/Login'
import { createBrowserRouter, RouterProvider } from 'react-router'
import RootLayout from './components/RootLayout'
import Home from './components/Home'
import Register from './components/Register'
import UserHome from './components/UserHome'
import { useEffect } from 'react'
import { useAuth } from './store/authStore'
import ProtectedRoute from './components/ProtectedRoute'
import AddItem from './components/AddItem'
import VerifyOtp from './components/VerifyOtp'
import ForgotPassword from './components/ForgetPassword'
import ResetPassword from './components/ResetPassword'
import ItemCard from './components/ItemCard'
import Orders from './components/Orders'
import DeliveryTracker from './components/DeliveryTracker'
import BuyItem from './components/BuyItem'
import SellerOrders from './components/SellerOrders'
import TestVideoPage from './components/TestVideoPage'
import AdminDashBoard from './components/AdminDashBoard'
import MyListings from './components/MyListings'
import UpdateItem from './components/UpdateItem'
import Cart from './components/Cart'
import Messages from './components/Messages'
import AllProducts from './components/AllProducts'
import HelpCenter from './components/HelpCenter'

const router = createBrowserRouter([{
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/userhome",
        element: 
        <ProtectedRoute allowedRoles={["USER"]} >
          <UserHome/>
        </ProtectedRoute>
      },
      {
        path: "/allproducts",
        element: 
        <ProtectedRoute allowedRoles={["USER"]} >
          <AllProducts/>
        </ProtectedRoute>
      },
      {
        path: "/additem",
        element: 
        <ProtectedRoute allowedRoles={["USER"]} >
          <AddItem/>
        </ProtectedRoute>
      },
      {
        path: "/item/:itemId",
        element: 
        <ProtectedRoute allowedRoles={["USER"]} >
          <ItemCard/>
        </ProtectedRoute>
      },
      {
        path:'/verifyotp',
        element:<VerifyOtp/>
      },
      {
        path:'/forgotpassword',
        element:<ForgotPassword/>
      },
      {
        path:'/resetpassword',
        element:<ResetPassword/>
      },
      {
        path: "/orders",
        element: 
        <ProtectedRoute allowedRoles={["USER"]} >
          <Orders/>
        </ProtectedRoute>
      },
      {
        path:"/delivery/:deliveryId",
        element: 
        <ProtectedRoute allowedRoles={["USER"]} >
          <DeliveryTracker/>
        </ProtectedRoute>
      },
      {
        path: "/buy/:itemId",
        element: 
        <ProtectedRoute allowedRoles={["USER"]} >
          <BuyItem/>
        </ProtectedRoute>
      },
      {
        path: "/seller-orders",
        element: 
        <ProtectedRoute allowedRoles={["USER"]} >
          <SellerOrders/>
        </ProtectedRoute>
      },
      {
        path:'/testvideo',
        element:
        <ProtectedRoute allowedRoles={["USER"]} >
          <TestVideoPage/>
        </ProtectedRoute>
      },
      {
        path:'/admin-dashboard',
        element:
        <ProtectedRoute allowedRoles={["ADMIN"]} >
          <AdminDashBoard/>
        </ProtectedRoute>
      },
      {
        path: "/myitems",
        element:
        <ProtectedRoute allowedRoles={["USER"]} >
          <MyListings/>
        </ProtectedRoute>
      },
      {
        path: "/update-item/:itemId",
        element:
        <ProtectedRoute allowedRoles={["USER"]} >
          <UpdateItem/>
        </ProtectedRoute>
      },
      {
        path: "/cart",
        element:
        <ProtectedRoute allowedRoles={["USER"]} >
          <Cart/>
        </ProtectedRoute>
      },
      {
        path: "/messages",
        element: 
        <ProtectedRoute allowedRoles={["USER"]} >
          <Messages/>
        </ProtectedRoute>
      },
      {
        path: "/help-center",
        element: 
        <ProtectedRoute allowedRoles={["USER"]} >
          <HelpCenter/>
        </ProtectedRoute>
      }
    ]
  }])

function App() {
  let { refresh } = useAuth()
  useEffect(() => {
    async function callRefresh() {
      await refresh();
    }
    callRefresh();
  }, []);
  
  return (
    <RouterProvider router={router} />
  )
}

export default App