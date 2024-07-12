import React, { useEffect, useCallback, useState } from "react";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";
import mic from "../Assets/mic.svg"

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams[0];
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  const handleDisconnect = useCallback(() => {
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
      setMyStream(null);
    }
    
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }

    peer.peer.close();
    peer.peer = new RTCPeerConnection();

    socket.emit("call:ended", { to: remoteSocketId });

    setRemoteSocketId(null);
  }, [myStream, remoteStream, remoteSocketId, socket]);

  const toggleCamera = useCallback(() => {
    if (myStream) {
      const videoTrack = myStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCameraOn(videoTrack.enabled);
      }
    }
  }, [myStream]);

  const toggleAudio = useCallback(() => {
    if (myStream) {
      const audioTrack = myStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioOn(audioTrack.enabled);
      }
    }
  }, [myStream]);

  return (
    <div RoomWrap>
      <div Room--container>
        <div Room--header>
          <h1>Welcom to the Room </h1>
          <div>{remoteSocketId ? <p>Connected</p> : <p>Disconnected</p>}</div>
          <h4>{remoteSocketId ? "Someone is in the room" : "No one in room"}</h4>
        </div> 
      <div className="btnCont">
       {remoteSocketId && <button className="Rbtn Rbtn--main" onClick={handleCallUser}>CALL</button>}
       {myStream && <button className="Rbtn Rbtn--main" onClick={sendStreams}>Send Stream</button>}
       {myStream?
       <div className="btnCont"><button className="Rbtn Rbtn--main" onClick={handleDisconnect}>Disconnect</button>
           <button className="Rbtn Rbtn--main" onClick={toggleCamera}>
           {cameraOn ? "Turn Off Camera" : "Turn On Camera"}
           </button>
           <button className="Rbtn Rbtn--main" onClick={toggleAudio}>
             {audioOn ? "Mute" : "Unmute"}
           </button> </div>:null
      }
      </div>
      <div className="roomCont">
        <div className="room--left">
      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            className="video"
            playing
            muted
            height="300px"
            width="500px"
            url={myStream}
            
          />
          
          
        </>
        
      )}
      </div>
      <div className="room--right">
      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
          className="video"
            playing
            height="300px"
            width="500px"
            url={remoteStream}
          />
        
        </>
       )}
      </div>
     </div>
    </div> 
  </div>
  );
};


export default RoomPage;
