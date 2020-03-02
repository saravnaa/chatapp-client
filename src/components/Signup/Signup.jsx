import React, {useState} from 'react'
import { withRouter } from 'react-router-dom'

function Signup(props) {
    const url = "http://localhost:4000"

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [cPassword, setCPassword] = useState("")

    const handleSignup = () => {
        return password === cPassword ?
        fetch(url+"/signup", {
            method : "post",
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({
                username,
                password
            })
        })
        .then(res => res.json())
        .then(user => {
            localStorage.setItem("chatuser",JSON.stringify(user))
            props.setLoggedUser(user)
            return props.history.push('/users')
        })
        : ""
    }
    return (
        <div>
            <div className="signup">
                <h2>Signup</h2>
                <hr/>
                <div
                    style={{
                        margin: "20px"
                    }}
                >
                    <input style={{
                        padding:"10px 30px"
                    }} placeholder="Username"type="text" name="username" id="username" onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div
                    style={{
                        margin: "20px"
                    }}
                >
                    <input style={{
                        padding:"10px 30px"
                    }} placeholder="Password"type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div
                    style={{
                        margin: "20px"
                    }}
                >
                    <input style={{
                        padding:"10px 30px"
                    }} placeholder="Confirm Password"type="password" name="cpassword" id="cpassword" onChange={(e) => setCPassword(e.target.value)}/>
                </div>
                <div
                    style={{
                        margin: "20px"
                    }}
                >
                    <button style={{
                        padding:"10px 20px"
                    }} onClick={handleSignup}>signup</button>
                </div>
                <div style={{
                    margin:"0px 20px 20px",
                    display:"inline-block",
                    cursor:"pointer",
                    color:"#61a3e8"
                }}
                onClick={()=> props.history.push('/')}
                >
                    already have an account?
                </div>
            </div>
        </div>
    )
}

export default withRouter(Signup)
