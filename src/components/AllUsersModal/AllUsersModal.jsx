import React from 'react'
import './AllUsersModal.css'

function AllUsersModal(props) {
    
    console.log("props.users",props.users)

    const handleAddChat = (reciever) => {
        fetch(props.url+"/addchat",{
            method : 'post',
            headers : {'Content-Type':'application/json'},
            body:JSON.stringify({
                userId : props.user.id,
                reciever : reciever
            })
        })
        .then(res => res.json())
        .then(res=> {
            if(res === "added"){
                props.fetchData()
                props.setVisible(false)
            }
        })
    }

    return (
        <div className="allUserModal" style={{display:(props.visible?"block":"none")}}>
            <div style={{paddingTop:"12px",color : "black",width:"100%", position:"relative"}}>
                Select a User
                <button style={{border:"none",outline:"none",backgroundColor:"red", color:"white", padding:"4px 5px", borderRadius:"3px",position:"absolute",top : "10px", right:"10px",cursor:"pointer"}} onClick={()=>props.setVisible(false)}>
                    X
                </button>
                {
                    props.users.length===0
                    ?   <h3 style={{marginTop:"30%",color:"black"}}>No more users to select</h3>
                    : <div style={{color:"white",marginTop:"20px"}}>
                    {
                        props.users.map((user,i) => <div key={i} onClick={()=> handleAddChat(user)}style={{margin:"5px",backgroundColor:"black",color:"white", padding:"8px"}}>
                                {user}
                            </div>)
                    }
                </div>
                }
            </div>
        </div>
    )
}

export default AllUsersModal
