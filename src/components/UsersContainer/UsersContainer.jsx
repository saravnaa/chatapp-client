// eslint-disable-next-line
import React, {useEffect, useState} from 'react'
import UserChat from './UserChat'
//eslint-disable-next-line
import io from 'socket.io-client'
import { withRouter } from 'react-router-dom'
import {IoIosLogOut} from 'react-icons/io'
import AllUsersModal from '../AllUsersModal/AllUsersModal'

function UsersContainer(props) {
    const [usernames, setUsernames] = useState([])
    const [messages, setMessages] = useState([])
    const [allUserModalVisible, setAllUserModalVisible] = useState(false)
    const [allUsers, setAllUsers] = useState([])

    // console.log(props.loggedUser)

    useEffect(()=> {
        console.log("username",usernames)
    },[usernames])

    useEffect(() => {
        if(!props.loggedUser){
            var user = JSON.parse(localStorage.getItem("chatuser"))
            console.log("user",user)
            if(user!==null)
                props.setUser(user)
            else 
                props.history.push('/')
        }
        console.log(props)
        fetchChatUsernames()
        fetch(props.url+"/createsocket", {
            method : 'get'
        })
        .then(res=>res.json())
        .then(res=>console.log(res))
        if(props.socket)
        props.socket.on('new chat', ()=> {
            console.log("new chat")
            fetchChatUsernames()
        })
        //eslint-disable-next-line
    },[])

    const fetchAllUserChats = () => {
        if(props.loggedUser)
        fetch(props.url+"/allusername/"+props.loggedUser.id,{
            method :"get",
        })
        .then(res=>res.json())
        .then(res=>{
            setAllUsers(res)
        })
    }

    const handleAddChatClick = () => {
        fetchAllUserChats()
        setAllUserModalVisible(true)
    }

    const handleRemoveChat = async (reciever) => {
        if(props.reciever === reciever)
            props.setReciever(null)
        fetch(props.url+'/removechat', {
            method : 'post',
            headers : {'Content-Type':'application/json'},
            body : JSON.stringify({
                userId : props.loggedUser.id,
                reciever
            })
        })
        .then(res => res.json())
        .then(res => fetchChatUsernames())
        
    }

    useEffect(()=> {
        if(props.loggedUser)
            fetchChatUsernames()
    },[props.loggedUser])

    const fetchChatUsernames = () => {
        if(props.loggedUser)
        fetch(props.url+'/userchats/'+props.loggedUser.id,{
            method : 'get'
        })
        .then(res => res.json())
        .then(users => {
            console.log("fetchlatest",users)
            // eslint-disable-next-line
            // users = users.filter(u => u !== props.loggedUser.username)
            setUsernames(users)
        })
    }

    const handleOpenChat = (reciever) => {
        var param = props.loggedUser.username>reciever?`${props.loggedUser.username}:${reciever}` : `${reciever}:${props.loggedUser.username}`;
        fetch(props.url+"/privatemessage/"+param,{
            method : "get"
        })
        .then(res => res.json())
        .then(res => {
            setMessages(res)
        })
        props.setReciever(reciever)
    }

    return (
        <div style={{
            display : "grid",
            gridTemplateColumns : "23% 77%",
            height:"100vh"
        }}>
            <div style={{
                width:"100%",
                height:"calc(100%)",
                // overflowY : "scroll",
                // padding:"0px 0px 50px 0px",
                backgroundColor:"white",
                borderRight:"1px solid black"
            }}>
                <div style={{backgroundColor:"#39753b",}}>
                    <div style={{padding:"13px 0px", textAlign:"center"}}>
                        <div style={{
                                boxShadow:"0px 0px 1px 3px black",
                                display:"inline-block",
                                verticalAlign:"super",
                                padding:"5px 12px",
                                color:"white"
                            }}
                        >
                                ChatApp
                        </div>
                        <div
                            style={{
                                display:"inline-block",
                                width:"20px",
                                height:"20px",
                                marginLeft : "25%",
                                marginRight:"10px"
                            }} 
                            onClick={()=>  {
                                props.setUser(null)
                                localStorage.removeItem("chatuser")
                                props.socket.disconnect()
                                props.setSocket(null)
                                props.history.push('/')
                        }}>
                            <IoIosLogOut style={{
                                width:"30px",
                                height:"25px",
                                marginTop:"10px"
                            }}/>
                        </div>
                    </div>
                </div>
                <div style={{
                        margin:"5px",
                        padding:"5px",
                        backgroundColor:"black",
                        color:"white"
                    }}
                    onClick={handleAddChatClick}
                >
                    Add Chat
                </div>
                <div style={{}}>
                    {usernames.map(username => {
                        return username!==props.loggedUser.username ? <div style={{fontSize: "0.8em", textAlign:"left",margin:"1%",backgroundColor:"#bfeea5", border : "1px solid black", paddingRight:"5%",position:"relative"}}><div onClick={(e)=>{handleOpenChat(e.target.id)}} id={username} style={{width:"90%",padding:"4% 2% 4% 4%",display:"inline-block"}}>{username}</div><span onClick={()=>handleRemoveChat(username)}style={{backgroundColor:"green",padding : "4% 2%",position:"absolute",right:"0px",border:"none",display:"inline-block"}}>X</span></div> : <span></span>
                    })}
                </div>
            </div>
            <div style={{borderLeft:"1px solid black"}}>
                {
                    props.reciever !== null 
                    ?   <UserChat messages={messages} setMessages={setMessages} loggedUser={props.loggedUser} socket={props.socket} reciever={props.reciever}/>
                    :   <p style={{
                            marginTop:"50vh",
                            fontSize:"30px"
                        }}>
                            Select a Chat
                        </p>
                }
            </div>
            {
                props.loggedUser
                ?   <AllUsersModal
                        user={props.loggedUser}
                        visible={allUserModalVisible}
                        setVisible={setAllUserModalVisible}
                        url={props.url}
                        fetchData={fetchChatUsernames}
                        users={allUsers}
                    />
                : <p></p>
            }
        </div>
    )
}

export default withRouter(UsersContainer)
