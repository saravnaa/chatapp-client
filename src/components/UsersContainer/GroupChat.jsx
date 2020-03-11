import React,{useState, useRef, useEffect} from 'react'

function GroupChat(props) {
    const [message, setMessage] = useState("")
    var prevDate = ""

    const bottomRef = useRef()

    useEffect(()=> {
        executeScroll()
        console.log(props.messages)
        if(props.messages.length>0){
        }
        // eslint-disable-next-line
    },[])
    
    const executeScroll = () => {
        scrollToRef(bottomRef)
    }
    
    const scrollToRef = (ref) => document.getElementById("chats").scrollTo(0, ref.current.offsetTop)
    
    useEffect(()=> {
        executeScroll()
        // props.socket.off("incoming_group_message")
        // props.socket.on("incoming_group_message",(data)=> {
        //     console.log(props.group.name,"incoming")
        //     if(props.group.id === data.group.id){
        //         props.setMessages([...props.messages,data])
        //     } else {
        //         console.log("not open")
        //         var temp = props.unread
        //         console.log(temp[data.group.id]===undefined || temp[data.group.id]===null ? 1 : temp[data.group.id]+1 )
        //         temp[data.group.id] = temp[data.group.id]===undefined || temp[data.group.id]===null ? 1 : temp[data.group.id]+1 
        //         console.log(temp)
        //         props.setUnread(temp)
        //         // props.setUnread({...props.unread,[data.group.id]:props.unread[data.group.id]===undefined || props.unread[data.group.id]===null ? 1 : props.unread[data.group.id]+1 })
        //     }
        // // }
        // })            
        // eslint-disable-next-line
    }, [props.messages])
    
    // console.log("unread",props.unread)
    // useEffect(()=> {
    // }, [props.unread])

    useEffect(()=> {
        console.log("changed",props.group.name)
    }, [props.group])

    const sendMessage =() => {
        console.log("send")
        if(message.trim().length !== 0){
            console.log("send if")
            props.socket.emit("group_message", message, props.loggedUser, props.group)
            setMessage("")
        }
    }

    // console.log(props.loggedUser, props.reciever)

    return (
        <div>
            <div style={{
                backgroundColor: "#39753b",
                color: "white",
                padding: "20px",
                height: "25px",
                textAlign: "left",
                position: "fixed",
                top: "0",
                width: "100%",
                zIndex:10
            }}>
                <span style={{
                    width:"30px",
                    height:"30px",
                    display: "inline-block",
                    textAlign:"center",
                    backgroundColor:"black",
                    borderRadius:"50%",
                    lineHeight:"25px"
                }}>{props.group.name[0]}</span>                
                <span style={{marginLeft:"20px", fontSize:"18px"}}>
                        {props.group.name}
                </span>
            </div>
            <div className="chats" id="chats" style={{margin:"65px 5px 0px 5px", height:"calc(100vh - 65px)", overflowX:"scroll"}}>
                {
                    props.messages.map((message, i)=> {
                        // console.log(message,i)
                        var fullDate = new Date(message.createdAt);
                        var todayDate = new Date(Date.now()) 
                        var today = fullDate.getFullYear() === todayDate.getFullYear() 
                                    ?   fullDate.getMonth() === todayDate.getMonth()
                                        ?   fullDate.getDate() === todayDate.getDate() 
                                            ?   true
                                            :   false
                                        :   false 
                                    :   false
                        var yesterday = fullDate.getFullYear() === todayDate.getFullYear() 
                                        ?   fullDate.getMonth() === todayDate.getMonth()
                                            ?   fullDate.getDate() === todayDate.getDate()-1 
                                                ?   true
                                                :   false
                                            :   false 
                                        :   false
                        var changeInDate = prevDate !== fullDate.getDate()+"."+fullDate.getMonth()+"."+fullDate.getFullYear()
                        prevDate = fullDate.getDate()+"."+fullDate.getMonth()+"."+fullDate.getFullYear();
                        return (
                            // (!message.group) || (message.group.id === props.group.id)
                               <div key={i}>
                                    <div style={{
                                        backgroundColor:"rgba(73, 212, 193, 0.61)",
                                        display:changeInDate ? "inline-block" : "none",
                                        padding : "4px 8px",
                                        borderRadius : "5px",
                                        boxShadow: "1px 1px 2px #959691"
                                    }}>
                                        {changeInDate ? today ? "Today" : yesterday ? "Yesterday" : prevDate : ""}
                                    </div>
                                    <div style={{textAlign: props.loggedUser.id === parseInt(message.from) ? "right" : "left"}}>
                                        <div style={{textAlign:"right",boxShadow: "2px 2px 2px #959691",backgroundColor: props.loggedUser.id === parseInt(message.from) ? "#c0f3a5":"#ffff86bf" , padding:"2px 10px",borderRadius:"6px",display:"inline-block",maxWidth:"50%",margin:"5px"}}>
                                            {
                                                props.loggedUser.id !== parseInt(message.from)
                                                ?   <div style={{marginLeft:"5px", fontWeight:"700", fontSize:"0.8em",textAlign:"left"}}>{message.sender.username}</div>
                                                :   <span></span>
                                            }
                                            <p style={{textAlign:"left",margin:"5px",wordBreak:"break-word", display:"inline-block"}}>{message.message}</p>
                                            <span style={{fontSize:"10px",margin:"5px",position:"relative", right:"-10px"}}>{(fullDate.getHours().toString().length===2 ? fullDate.getHours() : "0"+fullDate.getHours())+":"+(fullDate.getMinutes().toString().length===2 ? fullDate.getMinutes() : "0"+fullDate.getMinutes())}</span>
                                        </div>
                                    </div>
                                </div>
                            // :   <span></span>
                        )
                    })
                }
                <div style={{height:"50px"}}></div>
                <div ref={bottomRef} id="bottom"></div>
            </div>
                <div style={{
                    position:"fixed",
                    bottom:"0",
                    width:"100%",
                    display:"grid",
                    gridTemplateColumns:"70% 10%"
                }}>
                    <div style={{overflow:"hidden", height:"39px"}}>
                        <textarea placeholder="Enter Message" onChange={(e)=> setMessage(e.target.value)} value={message} style={{width:"100%",overflowY : "scroll",overflowX:"hidden", height:"28px", padding:"5px", resize:"none"}}type="text" name="message" id="message"/>
                        <span>{message.length}</span>
                    </div>
                    <div>
                        <button style={{width:"100%", padding:"13px 30px 13px 0px", backgroundColor:"green",fontSize:"12px",border:"none", outline:"none"}} onClick={sendMessage}>SEND</button>
                    </div>
                </div>
        </div>
    )
}

export default GroupChat
