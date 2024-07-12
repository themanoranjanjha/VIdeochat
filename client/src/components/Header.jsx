import React from 'react'
import { LogOut} from 'react-feather'
import { userAuth } from '../context/AuthContext'

const Header = () => {
    const {user, handleUserLogout} = userAuth()

//  const LogoutHandle = () =>{
//     handleUserLogout()
     
//   }

  return (
    <div id="header--wrapper">
       {user ? (
        <>
          <h5>welcome {user.name}</h5>
          <LogOut onClick={handleUserLogout} className="header--link"/>
        </>
       )
       : (
           <button>Login</button>
       )}
    </div>
  )
}

export default Header