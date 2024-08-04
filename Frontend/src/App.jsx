import Home from "./Pages/Home/Home"
import Login from "./Pages/Login/Login"
import {Routes ,Route} from "react-router-dom"
import Signup from "./Pages/Signup/Signup"

export default function App() {
  return (
    <Routes>
      <Route path ="/" element={<Home/>}/>
      <Route path ="/Home" element={<Home/>}/>
      <Route path ="/Login" element={<Login/>}/>
      <Route path ="/Signup" element={<Signup/>}/>
    </Routes>
    
  )
}


