// eslint-disable-next-line
import React, {useEffect, useState} from 'react'
import UserChat from './UserChat'
//eslint-disable-next-line
import { withRouter } from 'react-router-dom'
import {IoIosLogOut} from 'react-icons/io'
import AllUsersModal from '../AllUsersModal/AllUsersModal'
import CreateGroup from './CreateGroup'
import GroupChat from './GroupChat'

function UsersContainer(props) {
    const [usernames, setUsernames] = useState([])
    const [messages, setMessages] = useState([])
    const [allUserModalVisible, setAllUserModalVisible] = useState(false)
    const [allUsers, setAllUsers] = useState([])
    const [createGroupModalVisible, setCreateGroupModalVisible] = useState(false)
    const [userGroups, setUserGroups] = useState([])
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [reload, setReload] = useState(false)

    const [groupUnread, setGroupUnread] = useState({})
    const [chatUnread, setChatUnread] = useState({})
    const [onlineUsers, setOnlineUsers] = useState({})

    // console.log(props.loggedUser)

    // if(selectedGroup && selectedGroup.name)
    // console.log("selected",selectedGroup.name)

    console.log("state",groupUnread)

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
        if(props.socket){
            props.socket.on('new chat', ()=> {
                console.log("new chat")
                fetchChatUsernames()
            })
            props.socket.on('online',(user) => {
                console.log('online',user)
                var temp = onlineUsers
                temp[user] = true
                setOnlineUsers(temp)
                setReload(!reload)
            })
            props.socket.on('offline',(user) => {
                console.log("offline",user)
                var temp = onlineUsers
                var date = new Date(Date.now())
                var lastSeen = `last seen ${date.getDate()}/${date.getMonth()}/${date.getUTCFullYear()}  ${date.getHours().toString().length === 1 ? `0${date.getHours()}`:date.getHours()}:${date.getMinutes().toString().length===1?`0${date.getMinutes()}`:date.getMinutes()}`
                temp[user] = lastSeen
                console.log(temp)
                setOnlineUsers(temp)
                setReload(reload => !reload)
            })
        }
        //eslint-disable-next-line
    },[])

    console.log(onlineUsers)

    const getUserGroups = () => {
        if(props.loggedUser){
            fetch(props.url+"/getusergroups/"+props.loggedUser.id,{
                method : 'get'
            })
            .then(res=>res.json())
            .then(res => {
                setUserGroups(res)
                // setMessages([])
            })
        }
    }

    useEffect(()=> {
        if(props.socket){
            props.socket.off("incoming_message")
            props.socket.on("incoming_message",(data)=> {
                console.log(props.reciever ,data.username)
                if((props.reciever && props.reciever=== data.username) || props.loggedUser.username === data.username){
                    setMessages([...messages,data])
                }
                else {
                    console.log('not open')
                    var temp = chatUnread
                    temp[data.username] = temp[data.username] === undefined ? 1 : temp[data.username]+1
                    setChatUnread(temp)
                    setMessages([...messages])
                }
            })
            props.socket.off("incoming_group_message")
            props.socket.on("incoming_group_message",(data)=> {
                // console.log(props.group.name,"incoming")
                console.log("sg",selectedGroup)
                if(selectedGroup && selectedGroup.id === data.group.id){
                    setMessages([...messages,data])
                } else {
                    console.log("not open")
                    var temp = groupUnread
                    temp[data.group.id] = temp[data.group.id]===undefined || temp[data.group.id]===null ? 1 : temp[data.group.id]+1
                    setGroupUnread(temp)
                    setMessages([...messages])
                }
            }) 
            props.socket.off("new_group")
            props.socket.on("new_group",()=> {
                getUserGroups()
            })  
        // }
        }
    },[messages])

    const fetchAllUserChats = () => {
        if(props.loggedUser)
        fetch(props.url+"/newchatusername/"+props.loggedUser.id,{
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
        setCreateGroupModalVisible(false)
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
        if(props.loggedUser){
            fetchChatUsernames()
            getUserGroups()
        }
        // eslint-disable-next-line
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
        const temp = {...chatUnread,[reciever] : 0}
        // console.log("temp", temp)
        setSelectedGroup(null)
        setChatUnread(temp)
        setMessages([])
        fetch(props.url+"/privatemessage/"+param,{
            method : "get"
        })
        .then(res => res.json())
        .then(res => {
            setMessages(res)
        })
        fetch(props.url+"/online/"+reciever, {
            method : 'get'
        })
        .then(res => res.json())
        .then(res => {
            var temp = onlineUsers
            if(res.online){
                temp[reciever] = true
            } else {
                var date = new Date(res.lastSeen)
                var lastSeen = `last seen ${date.getDate()}/${date.getMonth()}/${date.getUTCFullYear()}  ${date.getHours().toString().length === 1 ? `0${date.getHours()}`:date.getHours()}:${date.getMinutes().toString().length===1?`0${date.getMinutes()}`:date.getMinutes()}`
                temp[reciever] = lastSeen
            }
            setOnlineUsers(temp)
            // console.log("set reciever")
            props.setReciever(reciever)
        })
    }

    console.log("chat",props.reciever, selectedGroup)

    console.log("selectedGroup", selectedGroup)

    const handleCreateGroup = () => {
        setAllUserModalVisible(false)
        setCreateGroupModalVisible(true)
    }

    const handleOpenGroup = (groupId) => {
        console.log(groupId)
        setGroupUnread({...groupUnread,[groupId]:0})
        props.setReciever(null)
        setMessages([])
        props.socket.emit("selected_group",props.loggedUser,groupId)
        fetch(props.url+"/getgroupdetails/"+groupId, {
            method:"get"
        })
        .then(res => res.json())
        .then(async group => {
            console.log("Hit sele")
            return await setSelectedGroup(group)
            // return  setMessages([])
        })
        fetch(props.url+"/groupmessages/"+groupId, {
            method : 'get'
        })
        .then(res => res.json())
        .then(data => setMessages(data))
    }

    const handleRemoveGroup = (groupId) => {
        fetch(props.url+"/leavegroup", {
            method : 'post',
            headers : {'Content-Type':'application/json'},
            body : JSON.stringify({
                userId:props.loggedUser.id,
                groupId
            })
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            setUserGroups(userGroups.filter(group => group.id !== groupId))
        })
        if(selectedGroup && selectedGroup.id === groupId)
            setSelectedGroup(null)
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
                                props.setReciever(null)
                                props.history.push('/')
                        }}>
                            <IoIosLogOut style={{
                                cursor : "pointer",
                                width:"30px",
                                height:"25px",
                                marginTop:"10px"
                            }}/>
                        </div>
                    </div>
                </div>
                <div style={{
                        cursor : "pointer",
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
                        return username!==props.loggedUser.username ? <div style={{fontSize: "0.8em", textAlign:"left",margin:"1%",backgroundColor:"#bfeea5", border : "1px solid black", paddingRight:"5%",position:"relative"}}><div onClick={(e)=>{handleOpenChat(e.target.id)}} id={username} style={{width:"90%",padding:"4% 2% 4% 4%",display:"inline-block",cursor:"pointer"}}>{username}</div><span style={{backgroundColor:"yellow",borderRadius:"50%",padding : "1% 2%",position:"absolute",right:"10%", top:"10%",border:"none",display:(chatUnread[username]===undefined||chatUnread[username]===0 ? "none" : "inline-block"),cursor:"pointer"}}>{chatUnread[username]===undefined?0:chatUnread[username]}</span><span onClick={()=>handleRemoveChat(username)}style={{backgroundColor:"green",padding : "4% 2%",position:"absolute",right:"0px",border:"none",display:"inline-block",cursor:"pointer"}}>X</span></div> : <span></span>
                    })}
                </div>
                <div style={{margin:"30px 5px 5px 5px"}}>
                    <div style={{backgroundColor:"black", padding:"5px 2px", color:"white",display:"block",position:"relative"}}>
                        <span>Groups</span>
                        <span style={{cursor : "pointer",position:"absolute", right:"10px", backgroundColor:"white", color:"black",padding:"1px 5px", borderRadius:"50%"}} onClick={handleCreateGroup}>+</span>
                    </div>
                    <div>
                        {
                            userGroups.map(group => 
                                <div style={{fontSize: "0.8em", textAlign:"left",margin:"1%",backgroundColor:"#bfeea5", border : "1px solid black", paddingRight:"5%",position:"relative"}}><div onClick={(e)=>{handleOpenGroup(group.id)}} id={group.id} style={{width:"90%",padding:"4% 2% 4% 4%",display:"inline-block",cursor:"pointer"}}>{group.name}</div><span style={{backgroundColor:"yellow",borderRadius:"50%",padding : "1% 2%",position:"absolute",right:"10%", top:"10%",border:"none",display:(groupUnread[parseInt(group.id)]===undefined||groupUnread[parseInt(group.id)]===0 ? "none" : "inline-block"),cursor:"pointer"}}>{groupUnread[parseInt(group.id)]===undefined?0:groupUnread[group.id]}</span><span onClick={()=>handleRemoveGroup(group.id)} style={{backgroundColor:"green",padding : "4% 2%",position:"absolute",right:"0px",border:"none",display:"inline-block",cursor:"pointer"}}>X</span></div>
                            )
                        }
                    </div>
                </div>
            </div>
            <div style={{borderLeft:"1px solid black"}}>
                {
                    props.reciever !== null
                    ?   <UserChat 
                            messages={messages} 
                            setMessages={setMessages}
                            loggedUser={props.loggedUser} 
                            socket={props.socket} 
                            reciever={props.reciever}
                            onlineUsers = {onlineUsers}
                        />
                    :   selectedGroup !== null
                        ?   <GroupChat
                                loggedUser={props.loggedUser}
                                group={selectedGroup}
                                messages={messages}
                                setMessages={setMessages}
                                socket={props.socket}
                                unread={groupUnread}
                                setUnread={setGroupUnread}
                            />
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
                : <p  
                    // style={{display:"none"}}
                    >
                        
                    </p>
            }
            {
                props.loggedUser
                ?   <CreateGroup
                        setVisible={setCreateGroupModalVisible}
                        visible={createGroupModalVisible}
                        url={props.url}
                        user={props.loggedUser}
                        getUserGroups={getUserGroups}
                        socket={props.socket}
                    />
                :   <p style={{display:"none"}}></p>
            }
        </div>
    )
}

export default withRouter(UsersContainer)
