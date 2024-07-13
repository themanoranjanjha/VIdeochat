import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import { nanoid } from "nanoid";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

const LobbyScreen = () => {

  const {user} = useAuth()
  console.log(user.email)
  const [email, setEmail] = useState(user.email);
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  const handleGenerateAndCopyRoomId = () => {
    const newRoomId = nanoid();
    setRoom(newRoomId);
    navigator.clipboard.writeText(newRoomId).then(() => {
      alert("Room ID generated and copied to clipboard!");
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <>
    <Header />
    <div className="LobbyW">
      <h1>Lobby</h1>
      <div className="formP">
      <form className="lobForm" onSubmit={handleSubmitForm}>
        <label htmlFor="email">Email ID</label>
        <input 
          className="roomNO"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.targe.user.email)}
         
        />
        <br />
        <label htmlFor="room">Room ID</label>
        <input 
          className="roomNO"
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <br />
        <div className="theCopy">
        <button type="button" className="Cbtn Cbtn--lg Cbtn--main " onClick={handleGenerateAndCopyRoomId}>Generate & Copy Room ID</button>
        <button className=" Cbtn Cbtn--lg Jbtn--main" type="submit">Join call</button>
        </div>
      </form>
      </div>
    </div>
    </> 
  );
};

export default LobbyScreen;
