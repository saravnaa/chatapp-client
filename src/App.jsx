import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css';
import io from 'socket.io-client'
import {
  Signin, Signup, UsersContainer
} from './componentsProvider'

function App() {

  const [user, setUser] = useState(null)
  //eslint-disable-next-line
  const [reciever, setReciever] = useState(null)
  const [socket, setSocket] = useState(null)
  const url="http://localhost:4000"

  useEffect(() => {
    if(user!==null){
      console.log(user)
      if(socket === null || user.username !== socket.nsp.slice(1))
      {
        var soc = io.connect(url+"/"+user.username)
        console.log(soc)
        setSocket(soc)
      }
      
    }
    // eslint-disable-next-line
  }, [user])

  useEffect(()=> {
    var user = JSON.parse(localStorage.getItem("chatuser"))
    console.log("userapp",user)
    if(user!==null)
        setUser(user)
  },[])

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/"><Signin url={url} setLoggedUser={setUser}/></Route>
          <Route path="/signup"><Signup url={url} setLoggedUser = {setUser}/></Route>
          <Route path="/users"><UsersContainer setSocket={setSocket} setUser={setUser} url={url} socket={socket} reciever={reciever} setReciever={setReciever} loggedUser={user}/></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
