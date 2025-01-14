import { waitUntilBucketExists } from "@aws-sdk/client-s3";

export default function handleSockets(io) {
  io.on("connection", (socket) => {
    socket.on("login", async ({ userId }) => {
      socket.join(userId);
      io.emit("userStatus", { userId, online: true });
    });

    socket.on("logout", async ({ userId }) => {
      socket.leave(userId);
      const room = io.sockets.adapter.rooms.get(userId);
      const online = room ? (room.size === 0 ? false : true) : false;
      io.emit("userStatus", { userId, online });
    });

    socket.on("get-userStatus", ({ userId }) => {
      const room = io.sockets.adapter.rooms.get(userId);
      const online = room ? (room.size === 0 ? false : true) : false;
      io.emit("userStatus", { userId, online });
    });

    // socket.on("update-user-queue", () => {
    //   io.emit("update-user-queue", null);
    // });

    socket.on("change-song", ({ userId, playback }) => {
      socket.broadcast.to(userId).emit("changeSong", playback);
      io.emit("update-user-queue", null);
    });
    socket.on("playback", ({ userId, playback }) => {
      socket.broadcast.to(userId).emit("playback-data", playback);
    });
  });
}
