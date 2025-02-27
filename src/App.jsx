import Nav from "./components/header/Nav"
import Footer from "./components/footer/Footer"
import { Outlet } from "react-router-dom"
export default function App() {
  return (
  
     <>
     <Nav/>
     <Outlet/>
     <Footer/>
     
     </>
  )
}


