import { useEffect, createContext, useReducer,useContext } from 'react';
import Navbar from './components/navbar';
import './App.css';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import Home from './components/screen/home';
import Login from './components/screen/login';
import Signup from './components/screen/signup';
import Profile from './components/screen/profile';
import CreatePost from './components/screen/createpost';
import UserProfile from './components/screen/UserProfile';
import SubscriberUserPosts from './components/screen/subscriberPost';
import Reset from './components/screen/reset';
import NewPassword from './components/screen/newPassword';
import Startup from './components/screen/startup';
import Footer from './components/screen/footer';

import { reducer, initialState } from './reducers/userReducer';

export const userContext = createContext();

const Routing = () => {
  const history = useHistory();
  const {state, dispatch} = useContext(userContext);
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({type:"USER",payload:user});
    }else{
      if(!history.location.pathname.startsWith('/reset-password')){
          history.push('/startup');
      }
    }
  },[])
  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/startup" >
        <Startup />
      </Route>
      <Route path="/login" >
        <Login />
      </Route>
      <Route path="/signup" >
        <Signup />
      </Route>
      <Route exact path="/profile" >
        <Profile />
      </Route>
      <Route path="/createpost" >
        <CreatePost />
      </Route>
      <Route path="/profile/:userid" >
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost" >
        <SubscriberUserPosts />
      </Route>
      <Route exact path="/reset-password" >
        <Reset />
      </Route>
      <Route path="/reset-password/:token" >
        <NewPassword  />
      </Route>
    </Switch>
  );
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <userContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
        <Footer />
      </BrowserRouter>
    </userContext.Provider>
  );
}
export default App;
