
import Navbar from './../../composants/Navbar';
import Footer from './../../composants/Footer';
import { Outlet } from 'react-router-dom';




const UserLayout = () => {
  return (
    <div>
          {/* barre de nav */}
         <Navbar/>
            <div className="">
                <Outlet/>
                 {/* <ToastContainer /> */}
            </div>
        {/* pied de page  */}
         <Footer/>

    </div>
  )
}

export default UserLayout
