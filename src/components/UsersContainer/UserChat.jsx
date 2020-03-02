import React,{useState, useEffect, useRef} from 'react'

function UserChat(props) {
    const [message, setMessage] = useState("")
    var prevDate = ""

    const bottomRef = useRef()

    useEffect(()=> {
        executeScroll()
        // eslint-disable-next-line
    },[])

    const executeScroll = () => {
        scrollToRef(bottomRef)
    }

    const scrollToRef = (ref) => document.getElementById("chats").scrollTo(0, ref.current.offsetTop)

    useEffect(()=> {
        console.log(props.messages)
        props.socket.on("incoming_message",(data)=> {
            props.setMessages([...props.messages,data])
        })
        executeScroll()

        // eslint-disable-next-line
    }, [props.messages])
    const sendMessage =() => {
        if(message.trim().length !== 0){
            props.socket.emit("message", message, props.loggedUser, props.reciever)
            setMessage("")
        }
    }

    console.log(props.loggedUser, props.reciever)

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
            }}>
                <span style={{
                    width:"30px",
                    height:"30px",
                    display: "inline-block",
                    textAlign:"center",
                    backgroundColor:"black",
                    borderRadius:"50%",
                    lineHeight:"25px"
                }}>{props.reciever[0]}</span>                
                <span style={{marginLeft:"20px", fontSize:"18px"}}>
                        {props.reciever}
                </span>
            </div>
            <div className="chats" id="chats" style={{margin:"65px 5px 0px 5px", height:"calc(100vh - 65px)", overflowX:"scroll"}}>
                {
                    props.messages.map(message=> {
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
                            <div>
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
                                        <p style={{textAlign:"left",margin:"5px",wordBreak:"break-word", display:"inline-block"}}>{message.message}</p>
                                        <span style={{position:"",fontSize:"10px",margin:"5px",position:"relative", right:"-10px"}}>{(fullDate.getHours().toString().length===2 ? fullDate.getHours() : "0"+fullDate.getHours())+":"+(fullDate.getMinutes().toString().length===2 ? fullDate.getMinutes() : "0"+fullDate.getMinutes())}</span>
                                    </div>
                                </div>
                            </div>
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

export default UserChat
