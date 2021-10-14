import SocketIO from "socket.io-client";

export const io = SocketIO("http://localhost:4000/game", {
  withCredentials: true,
});

export const ioChannel = SocketIO("http://localhost:4501/channel", {
  withCredentials: true,
})

export const ioCommunity = SocketIO("http://localhost:4500/community", {
  withCredentials: true,
})