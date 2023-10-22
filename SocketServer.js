exports.Actions = (socket) => {
  // user join or open messages
  socket.on("join", (user) => {
    socket.join(user);
  });

  // join a conversation room
  socket.on("join conversation", (conversation) => {
    socket.join(conversation);
  });

  //send and recibe message
  socket.on("send message", (message) => {
    console.log("new message", message);
    let conversation = message.conversation;
    if (!conversation.users) return;
    conversation.users.forEach((user) => {
      if (user.id === message.sender._id) return;
      socket.in(user.id).emit("message recived", message);
    });
  });
};
