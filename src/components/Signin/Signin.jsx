import React, {useState} from 'react'
import {withRouter} from 'react-router-dom'

function Signin(props) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    

    const handleSignin = () => {
        fetch(props.url+'/signin', {
            method : "post",
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify({
                username,
                password
            })
        })
        .then(res => res.json())
        .then(res => {
            if(!res.error){
                localStorage.setItem("chatuser",JSON.stringify(res))
                props.setLoggedUser(res)
                props.history.push("/users")
            }
        })
    }

    return (
        <div>
            <div className="signin">
                <h2>Signin</h2>
                <hr/>
                <div style={{
                    margin : "20px"
                }}>
                    <input style={{
                        padding:"10px 30px"
                    }} type="text" name="username" id="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div style={{
                    margin : "20px"
                }}>
                    <input style={{
                        padding:"10px 30px"
                    }} type="password" name="password" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div style={{
                    margin : "20px"
                }}>
                    <button style={{
                        padding:"10px 20px"
                    }} onClick={handleSignin}>login</button>
                </div>
                <div style={{
                    margin:"0px 20px 20px",
                    display:"inline-block",
                    cursor:"pointer",
                    color:"#61a3e8"
                }}
                onClick={()=> props.history.push('signup')}
                >
                    not a user?
                </div>
            </div>
        </div>
    )
}

export default withRouter(Signin)
