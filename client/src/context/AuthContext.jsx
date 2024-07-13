import { createContext, useState, useEffect,  useContext } from "react";
import { account } from '../Appwrite/AppwriteConfig';
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        getUserOnLoad() 
        
    }, [])

    const getUserOnLoad = async () =>{
        try{
            const accountDetails = await account.get();
            setUser(accountDetails)
        }catch(error){
            console.log(error)
        }
        setLoading(false)
    }

    const handleUserLogin = async (e, credentials) => {
        e.preventDefault()

        try{
           const response = await account.createEmailPasswordSession(
               credentials.email,
               credentials.password
           );
           console.log('LOGINED', response)
           const accountDetails =  account.get();
           setUser(accountDetails)
           navigate('/lobby')

        }catch(error){
            window.alert(error);
        
        }
    }
    const handleUserLogout = async () => {
        
            await account.deleteSession('current');
            setUser(false)    
            navigate('/')
        
    }

    const handleRegister = async (e, credentials) => {
        e.preventDefault();
        console.log("Handle Register triggered!", credentials);

        if (credentials.password1 !== credentials.password2) {
            alert("Passwords did not match!");
            return;
        }

        try {
            let response = await account.create(
                ID.unique(),
                credentials.email,
                credentials.password1,
                credentials.name
            );
            console.log("User registered!", response);

            await account.createEmailPasswordSession(
                credentials.email,
                credentials.password1
            );
            let accountDetails = await account.get();
            setUser(accountDetails);
            navigate("/lobby");
        } catch (error) {
            console.error(error);
        }
    };

    // context data
    const contextData = {
       user,
       handleUserLogin,
       handleUserLogout,
       handleRegister
     }

     return (
          <AuthContext.Provider value={contextData}>
               {loading ? <p>Loading...</p> : children}
               {/* {children} */}
          </AuthContext.Provider>
     )

}

export const useAuth = () => useContext(AuthContext)
export default AuthContext