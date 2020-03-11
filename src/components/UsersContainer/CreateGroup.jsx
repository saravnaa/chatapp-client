import React from 'react'
import './CreateGroup.css'
import { useState, useEffect } from 'react'

function CreateGroup(props) {
    const [name, setName] = useState("")
    const [selectedUsers, setSelectedUsers] = useState([])

    const handleCreate = () => {
        console.log(name)
        fetch(props.url+"/creategroup", {
            method : 'post',
            headers : {'Content-Type':'application/json'},
            body: JSON.stringify({
                admin : props.user.id,
                users : selectedUsers,
                name 
            })
        })
        .then(res =>{
            setName("")
            props.socket.emit('new_group',selectedUsers)
            setSelectedUsers([])
            props.setVisible(false)
            props.getUserGroups()
        }
        )
    }

    useEffect(()=> {
        console.log("selected", selectedUsers)
    }, [selectedUsers])

    return (
        <div className="createGroupModal" style={{display:(props.visible ? "block" : 'none')}}>
            <div style={{position:"relative", height:"100%"}}>
                <div style={{position:"relative",marginBottom:"20px"}}>
                    <span style={{fontSize:"1.2em"}}>New Group</span>
                    <span style={{border:"none",outline:"none",backgroundColor:"red", color:"white", padding:"4px 5px", borderRadius:"3px",position:"absolute",top : "-5px", right:"-5px",cursor:"pointer"}} onClick={()=> props.setVisible(false)}>X</span>
                </div>
                <input onChange={(e)=> setName(e.target.value)} value={name} placeholder="Group Name" className="groupName" type="text"/>
                <div style={{height:"250px", overflowY:"scroll", marginTop:"20px"}}>
                    <Users 
                        url={props.url}
                        user={props.user}
                        setSelectedUsers={setSelectedUsers}
                        selectedUsers={selectedUsers}
                    />
                </div>
                <button style={{position:"absolute", bottom:"10px", right:"10px"}}onClick={handleCreate}>
                    Create
                </button>
            </div>
        </div>
    )
}

const Users = (props) => {
    const [allUsers, setAllUsers] = useState([])

    useEffect(()=> {
        fetch(props.url+"/allusername/"+props.user.id,{
            method : 'get'
        })
        .then(res=>res.json())
        .then(setAllUsers)
        // eslint-disable-next-line
    },[])

    const handleSelect = (id) => {
        props.selectedUsers.includes(id)
        ? props.setSelectedUsers(props.selectedUsers.filter(userId => userId!==id))
        : props.setSelectedUsers([...props.selectedUsers,id])
    }
    return allUsers.map((user,i) => <div key={i} onClick={()=>handleSelect(user.id)}style={{boxShadow:(props.selectedUsers.includes(user.id)?"0px 0px 3px 2px gray":""),margin:"10px",backgroundColor:(props.selectedUsers.includes(user.id)?"white":"black"),color:(!props.selectedUsers.includes(user.id)?"white":"black"), padding:"5px"}}>{user.username}</div>)
}

export default CreateGroup