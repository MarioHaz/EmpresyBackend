const { sendEmail } = require("../helpers/mailer");
const User = require("../models/User");
const Messages = require("../models/messageModel.js");
const {
  updateLatestMessage,
  populateConversation,
} = require("../services/conversation.service");
const { populateMessage } = require("../services/message.service");
const {
  createMessage,
  getConvoMessages,
} = require("../services/message.service");

newMessageTemplate = () => {
  return `
  <div style="display:flex; margin-bottom:1rem; max-width:100%; align-items:center; gap:10px; font-family:sans-serif; font-weight:600; color:#398ad5">
    <span>
      <strong>Tienes un mensaje: revisa tus mensajes en empresy</strong>
    </span>
  </div>

  <div style="padding:1rem 0; border-top:1px solid #e5e5e5; border-bottom:1px solid #e5e5e5; color:#141823; font-size:17px; font-family:sans-serif">

    <div style="padding:20px 0">
      <span style="padding:1.5rem 0">
        Quieren contactar contigo, revisa quien te envio un mensaje en tu cuenta de empresy.
      </span>
    </div>

    <a href="https://empresy.com" style="width:200px; padding:10px 15px; background:#398ad5; color:#fff; text-decoration:none; font-weight:600; border-radius:10px">
      Ir a empresy
    </a><br>

    <div style="padding-top:20px">
      <span style="margin:1.5rem 0; color:#898f9c">
        Empresy te permite mantener contacto con otras empresas. Una vez registrado en Empresy, podrás compartir tus productos, contactar proveedores y mucho más.
      </span>
    </div>
  </div>`;
};

exports.sendMessage = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { message, convo_id, files } = req.body;

    if (!convo_id || (!message && !files)) {
      console.log("error provide conversation id and message body");
      return res.sendStatus(400);
    }

    const messages = await getConvoMessages(convo_id);

    let sentMessageTrue = messages.map((message) => {
      return message.sender._id.toString() === user_id;
    });

    const isAnyTrue = sentMessageTrue.includes(true);

    if (isAnyTrue) {
      // At least one message is false, so set sentMessage to false
      sentMessageTrue = true;
    } else {
      // There are no false values, so set sentMessage to true
      sentMessageTrue = false;
    }

    console.log(sentMessageTrue);
    console.log(user_id);

    const populatedConvo = await populateConversation(
      convo_id,
      "users",
      "-password"
    );

    if (sentMessageTrue === false || sentMessageTrue.length === 0) {
      const receiver = populatedConvo.users
        .map((profile) => {
          if (profile._id.toString() !== user_id) {
            return profile;
          }
          return null; // Return null for the user that matches user_id
        })
        .filter((profile) => profile !== null)[0];

      // Now, 'receiver' will contain the user profile that doesn't match the 'user_id'

      sendEmail(
        receiver.email,
        "Tienes un mensaje en empresy - Quieren contactar contigo!",
        newMessageTemplate()
      );
    }

    const msgData = {
      sender: user_id,
      message,
      conversation: convo_id,
      files: files || [],
    };
    let newMessage = await createMessage(msgData);
    let populateMessages = await populateMessage(newMessage._id);
    await updateLatestMessage(convo_id, newMessage);
    res.json(populateMessages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const convo_id = req.params.convo_id;
    if (!convo_id) {
      return res.sendStatus(400);
    }

    const messages = await getConvoMessages(convo_id);

    res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const data = await Messages.findById(messageId);
    const convo_id = data.conversation;
    const premessages = await getConvoMessages(convo_id);
    await Messages.findByIdAndRemove(messageId);
    const posmessages = await getConvoMessages(convo_id);

    // Check if the deleted message was the last message
    const isLastMessage =
      premessages[premessages.length - 1]._id.toString() === messageId;

    // Update latestMessage if the deleted message was the last one
    if (isLastMessage && posmessages.length > 0) {
      const newLatestMessage = posmessages[posmessages.length - 1]._id;
      // Update the conversation's latestMessage using the updateLatestMessage function
      await updateLatestMessage(convo_id, newLatestMessage);
    }

    res.json({ status: "ok", data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
