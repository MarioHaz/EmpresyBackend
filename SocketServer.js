let onlineUsers = [];

exports.Actions = (socket, io) => {
  // user join or open messages
  socket.on("join", (user) => {
    socket.join(user);
    // add joined user to online users
    if (!onlineUsers.some((u) => u.userId === user)) {
      onlineUsers.push({ userId: user, socketId: socket.id });
    }
    // send online users
    io.emit("get-online-users", onlineUsers);
  });

  //socket disconnected
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("get-online-users", onlineUsers);
  });

  // join a conversation room
  socket.on("join conversation", (conversation) => {
    socket.join(conversation);
  });

  //send and recibe message
  socket.on("send message", (message) => {
    let conversation = message.conversation;
    socket.emit("send message", message);
    if (!conversation.users) return;
    conversation.users.forEach((user) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit("receive message", message);
    });
  });

  //typing
  socket.on("typing", (conversation) => {
    socket.in(conversation).emit("typing", conversation);
  });
  socket.on("stop typing", (conversation) => {
    socket.in(conversation).emit("stop typing");
  });

  //delete message

  socket.on("delete", (message) => {
    socket.in(message.conversation._id).emit("delete", message._id);
  });
  // listen open_conversation_outside
  socket.on("conversation_from_profile", (receiver) => {
    socket.emit("conversation_from_profile", receiver);
  });
};
