const { sendEmail } = require("../helpers/mailer");
const { generateToken, verifyToken } = require("../helpers/tokens");
const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation");
const User = require("../models/User");
const Post = require("../models/Post");
const Code = require("../models/Code");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateCode = require("../helpers/generateCode");
const mongoose = require("mongoose");
const unorm = require("unorm");

verificationTemplate = (user) => {
  const emailVerificationToken = generateToken(
    { id: user._id.toString() },
    "24h"
  );

  const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
  return `
  <div style="display:flex; margin-bottom:1rem; max-width:7; align-items:center; gap:10px; font-family:sans-serif; font-weight:600; color:#398ad5">
    <img width="170px" src="https://res.cloudinary.com/danfiejkv/image/upload/v1681770032/Logo-empresy-web_djmfw2.png" alt="">
    <span>
      <strong>Acción requerida: Activa tu cuenta de Empresy</strong>
    </span>
  </div>

  <div style="padding:1rem 0; border-top:1px solid #e5e5e5; border-bottom:1px solid #e5e5e5; color:#141823; font-size:17px; font-family:sans-serif">
    <span>Hola ${user.company_Name}</span>

    <div style="padding:20px 0">
      <span style="padding:1.5rem 0">
        Recientemente has creado una cuenta en Empresy. Para completar tu registro, por favor confirma tu cuenta.
      </span>
    </div>

    <a href=${url} style="width:200px; padding:10px 15px; background:#398ad5; color:#fff; text-decoration:none; font-weight:600; border-radius:10px">
      Confirma tu cuenta
    </a><br>

    <div style="padding-top:20px">
      <span style="margin:1.5rem 0; color:#898f9c">
        Empresy te permite mantener contacto con otras empresas. Una vez registrado en Empresy, podrás compartir tus productos, contactos de proveedores y mucho más.
      </span>
    </div>
  </div>`;
};

resetPasswordTemplate = (userName, code) => {
  return `
   
    <div style="padding: 1rem 0; border-top: 1px solid #e5e5e5; border-bottom: 1px solid #e5e5e5; color: #141823; font-size: 17px; font-family: sans-serif">
    <div style="display: flex; margin-bottom: 1rem; max-width: 7; align-items: center; gap: 10px; font-family: sans-serif; font-weight: 600; color: #398ad5">
      <img width="170px" src="https://res.cloudinary.com/danfiejkv/image/upload/v1681770032/Logo-empresy-web_djmfw2.png" alt="">
      <span>Código de restablecimiento de contraseña</span>
    </div>
      <span>Hola ${userName}</span>
      <div style="padding: 20px 0">
        <span style="padding: 1.5rem 0">Aquí tienes tu código de verificación. Sigue las instrucciones para restablecer tu contraseña.</span>
      </div>
      <a style="width: 200px; padding: 10px 15px; background: #398ad5; color: #fff; text-decoration: none; font-weight: 600; border-radius: 10px">${code}</a><br>
      <div style="padding-top: 20px">
        <span style="margin: 1.5rem 0; color: #898f9c">Empresy te permite estar en contacto con otras empresas. Una vez registrado en empresy, podrás compartir tus productos, contactar proveedores y mucho más.</span>
      </div>
    </div>
  `;
};

exports.register = async (req, res) => {
  try {
    const {
      company_Name,
      email,
      password,
      username,
      phone_number,
      Economic_Sector,
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    const check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({
        message: "Email adress already exists",
      });
    }

    if (!validateLength(company_Name, 3, 30)) {
      return res.status(400).json({
        message: "Company name must be between 3 and 30 characters",
      });
    }
    // if (!validateLength(username, 3, 30)) {
    //   return res.status(400).json({
    //     message: "User name must be between 3 and 30 characters",
    //   });
    // }
    if (!validateLength(password, 6, 40)) {
      return res.status(400).json({
        message: "Password must be between 3 and 30 characters",
      });
    }

    const cryptedPassword = await bcrypt.hash(password, 12);

    let tempUsername = company_Name;
    let newUsername = await validateUsername(tempUsername);

    const user = await new User({
      company_Name,
      email,
      password: cryptedPassword,
      username: newUsername,
      Economic_Sector: Economic_Sector,
      phone_number: phone_number,
    }).save();
    sendEmail(
      user.email,
      "Empresy - Verificación de correo electronico",
      verificationTemplate(user)
    );

    const token = generateToken({ id: user._id.toString() }, "30d");
    const refresh_token = generateToken({ id: user._id.toString() }, "30d");

    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      company_Name: user.company_Name,
      token: token,
      verified: user.verified,
      Economic_Sector: user.Economic_Sector,
      phone_number: user.phone_number,
      notificationFollowing: user.notificationFollowing,
      notificationAll: user.notificationAll,
      notificationComment: user.notificationComment,
      notificationReact: user.notificationReact,
      message: "Registro exitoso! por favor verifica tu cuenta para comenzar",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.activateAccount = async (req, res) => {
  try {
    const validUser = req.user.id;
    const { token } = req.body;
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const check = await User.findById(user.id);

    if (validUser !== user.id) {
      return res.status(400).json({
        message: "You do not have permission to access",
      });
    }
    if (check.verified == true) {
      return res.status(400).json({
        message: "this email is already activated",
      });
    } else {
      await User.findByIdAndUpdate(user.id, { verified: true });
      return res.status(200).json({
        message: "Account activated successfully.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "The email address you entered is not conected to an account",
      });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: "The password you entered is incorrect",
      });
    }
    const token = generateToken({ id: user._id.toString() }, "30d");
    const refresh_token = generateToken({ id: user._id.toString() }, "30d");

    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    await user.populate(
      "notificationFollowing.user notificationAll notificationComment.user notificationReact.user",
      "company_Name username picture"
    );

    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      company_Name: user.company_Name,
      token: token,
      verified: user.verified,
      Economic_Sector: user.Economic_Sector,
      phone_number: user.phone_number,
      notificationFollowing: user.notificationFollowing,
      notificationAll: user.notificationAll,
      notificationComment: user.notificationComment,
      notificationReact: user.notificationReact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.sendVerification = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (user.verified === true) {
      return res.status(400).json({
        message: "This user is already activated",
      });
    }

    sendEmail(
      user.email,
      "Empresy - Verificación de correo electronico",
      verificationTemplate(user)
    );
    return res.status(200).json({
      message: "Email verification link has been sent to your email",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.findUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(400).json({
        message: "Account does not exist",
      });
    }
    return res.status(200).json({
      email: user.email,
      picture: user.picture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendResetPasswordCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    await Code.findOneAndRemove({ user: user._id });
    const code = generateCode(5);
    const savedCode = await new Code({
      code,
      user: user._id,
    }).save();
    sendEmail(
      user.email,
      "Empresy - Re-establece tu contraseña",
      resetPasswordTemplate(user.company_Name, code)
    );
    return res.status(200).json({
      message:
        "correo con codigo de restrablecimiento ha sido enviado a tu email",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.validateResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    const Dbcode = await Code.findOne({ user: user._id });
    if (Dbcode.code !== code) {
      return res.status(400).json({
        message: "The verification code that you entered is not correct",
      });
    }
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const { email, password } = req.body;
  const cryptedPassword = await bcrypt.hash(password, 12); // TODO: revisar si tiene salt.
  await User.findOneAndUpdate(
    { email },
    {
      password: cryptedPassword,
    }
  );
  return res.status(200).json({ message: "ok" });
};
exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findById(req.user.id);
    const profile = await User.findOne({ username }).select("-password");

    const friendship = {
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    };
    if (!profile) {
      return res.json({ ok: false });
    }

    if (
      user.friends.includes(profile._id) &&
      profile.friends.includes(user._id)
    ) {
      friendship.friends = true;
    }
    if (user.following.includes(profile._id)) {
      friendship.following = true;
    }
    if (user.requests.includes(profile._id)) {
      friendship.requestReceived = true;
    }
    if (profile.requests.includes(user._id)) {
      friendship.requestSent = true;
    }

    const post = await Post.find({ user: profile._id })
      .populate("user")
      .populate(
        "comments.commentBy",
        "company_Name picture username commentAt "
      )
      .sort({ createdAt: -1 });
    await profile.populate("followers", "company_Name username picture");
    await profile.populate("following", "company_Name username picture");
    await profile.populate(
      "notificationFollowing.user",
      "company_Name username picture"
    );
    await profile.populate(
      "notificationAll",
      "company_Name username picture type"
    );
    await profile.populate(
      "notificationComment.user",
      "company_Name username picture type"
    );
    await profile.populate(
      "notificationReact.user",
      "company_Name username picture type"
    );
    res.json({ ...profile.toObject(), post, friendship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateProfilePicture = async (req, res) => {
  try {
    const { url } = req.body;
    await User.findByIdAndUpdate(req.user.id, {
      picture: url,
    });
    res.json(url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateCover = async (req, res) => {
  try {
    const { url } = req.body;
    await User.findByIdAndUpdate(req.user.id, {
      cover: url,
    });
    res.json(url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAbout = async (req, res) => {
  try {
    const { infos } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        details: infos,
      },
      {
        new: true,
      }
    );
    res.json(updated.details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addFriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        !receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $push: { requests: sender._id },
        });
        await receiver.updateOne({
          $push: { followers: sender._id },
        });
        await sender.updateOne({
          $push: { following: receiver._id },
        });
      } else {
        return res.status(400).json({ message: "Already sent" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "you cant send a request to yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $pull: { requests: sender._id },
        });
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });
        await sender.updateOne({
          $pull: { following: sender._id },
        });
      } else {
        return res.status(400).json({ message: "Already canceled" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "you cant cancel a request to yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.follow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        !receiver.followers.includes(sender._id) &&
        !sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $push: { followers: sender._id },
        });
        await receiver.updateOne({
          $push: {
            notificationFollowing: {
              type: "following", // Add the type to differentiate between notifications
              user: sender._id,
              createdAt: new Date(),
            },
          },
        });
        await receiver.updateOne({
          $push: { notificationAll: sender._id },
        });
        await sender.updateOne({
          $push: { following: receiver._id },
        });

        res.json({ message: "Follow succes" });
      } else {
        return res.status(400).json({ message: "Already following" });
      }
    } else {
      return res.status(400).json({ message: "you cant follow to yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unfollow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        (receiver.followers.includes(sender._id) &&
          sender.following.includes(receiver._id)) ||
        (!receiver.followers.includes(sender._id) &&
          sender.following.includes(receiver._id)) ||
        (receiver.followers.includes(sender._id) &&
          !sender.following.includes(receiver._id))
      ) {
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });
        await sender.updateOne({
          $pull: { following: sender._id },
        });
        await sender.updateOne({
          $pull: { following: receiver._id },
        });
        res.json({ message: "unfollow succes" });
      } else {
        return res.status(400).json({ message: "Already not following" });
      }
    } else {
      return res.status(400).json({ message: "you cant unfollow yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.params.id);
      if (receiver.requests.includes(sender._id)) {
        await receiver.updateOne({
          $push: { friends: sender._id },
        });
        await receiver.updateOne({
          $push: { following: sender._id },
        });
        await sender.updateOne({
          $push: { friends: receiver._id },
        });
        await sender.updateOne({
          $push: { followers: receiver._id },
        });
        await receiver.updateOne({
          $pull: { requests: sender._id },
        });
        res.json({ message: "connect accepted" });
      } else {
        return res.status(400).json({ message: "Already friends" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "you cant accept a request from yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unfriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        receiver.friends.includes(sender._id) &&
        sender.friends.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $pull: { friends: sender._id },
        });
        await receiver.updateOne({
          $push: { following: sender._id },
        });
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });
        await sender.updateOne({
          $pull: { friends: receiver._id },
        });
        await sender.updateOne({
          $push: { following: receiver._id },
        });
        await sender.updateOne({
          $pull: { followers: receiver._id },
        });
        res.json({ message: "unfriend allready set" });
      } else {
        return res.status(400).json({ message: "Already not friends" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "you cant accept a request from yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.params.id);
      if (receiver.requests.includes(sender._id)) {
        await receiver.updateOne({
          $pull: {
            requests: sender._id,
          },
        });
        await receiver.updateOne({
          $pull: {
            followers: sender._id,
          },
        });

        await sender.updateOne({
          $pull: {
            following: receiver._id,
          },
        });

        res.json({ message: "delete connection accepted" });
      } else {
        return res.status(400).json({ message: "Already deleted" });
      }
    } else {
      return res.status(400).json({ message: "you cant delete yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    // Split the searchTerm into words

    // Check if there are at least three words in the input
    if (searchTerm.length < 3) {
      return res.json([]); // Return an empty array if less than three words
    }
    const regex = new RegExp(`.*${diacriticSensitiveRegex(searchTerm)}.*`, "i"); // Create a case-insensitive regex
    const results = await User.find({
      $or: [
        { company_Name: { $regex: regex } }, // Search by company_Name
        { Economic_Sector: { $regex: regex } }, // Search by company_Name
        { "details.bio": { $regex: regex } }, // Search by company_Name
      ],
    })
      .select("company_Name picture username")
      .populate("details.currentCity");
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function diacriticSensitiveRegex(string = "") {
  return string
    .replace(/a/g, "[aáàä]")
    .replace(/e/g, "[eéë]")
    .replace(/i/g, "[iíï]")
    .replace(/o/g, "[oóöò]")
    .replace(/u/g, "[uüúù]");
}

exports.searchVisitor = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    if (searchTerm.length < 3) {
      return res.json([]); // Return an empty array if less than three words
    }
    const regex = new RegExp(`.*${diacriticSensitiveRegex(searchTerm)}.*`, "i"); // Create a case-insensitive regex
    const results = await User.find({
      $or: [
        { company_Name: { $regex: regex } }, // Search by company_Name
        { Economic_Sector: { $regex: regex } }, // Search by company_Name
        { "details.bio": { $regex: regex } }, // Search by company_Name
      ],
    })
      .select("company_Name picture username")
      .populate("details.currentCity");
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToSearchHistory = async (req, res) => {
  try {
    const { searchUser } = req.body;
    const search = {
      user: searchUser,
      createdAt: new Date(),
    };
    const user = await User.findById(req.user.id);
    const check = user.search.find((x) => x.user.toString() === searchUser);

    if (check) {
      await User.updateOne(
        {
          _id: req.user.id,
          "search._id": check._id,
        },
        {
          $set: { "search.$.createdAt": new Date() },
        }
      );
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          search,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSearchHistory = async (req, res) => {
  try {
    const results = await User.findById(req.user.id)
      .select("search")
      .populate("search.user", "company_Name username picture");
    res.json(results.search);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.removeFromSearch = async (req, res) => {
  try {
    const { searchUser } = req.body;
    await User.updateOne(
      {
        _id: req.user.id,
      },
      { $pull: { search: { user: searchUser } } }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.notificationAll && user.notificationAll.length > 0) {
      // Update the 'notificationAll' array to an empty array for the user with the given ID.
      await User.findByIdAndUpdate(
        req.user.id,
        { notificationAll: [] },
        { new: true } // This option returns the updated user document after the update.
      );
    }
    res.status(200).json({ message: "Notifications removed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("followers following Economic_Sector")
      .populate("followers", "company_Name username picture")
      .populate("following", "company_Name username picture");
    const similarSector = await User.find({
      Economic_Sector: user.Economic_Sector,
    }).select("company_Name username picture");
    res.json({
      followers: user.followers,
      following: user.following,
      similarSector,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("notificationAll")
      .populate("notificationAll", "company_Name username picture");

    res.json(user.notificationAll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.refreshtoken = async (req, res) => {
  try {
    const refresh_token = req.cookies.refreshtoken;

    if (!refresh_token)
      return res.status(400).json({ message: "Inicia sesion" });

    const check = verifyToken(refresh_token, process.env.TOKEN_SECRET);

    const user = await User.findById(check.id);

    const token = generateToken({ id: user._id.toString() }, "30d");

    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      company_Name: user.company_Name,
      token: token,
      verified: user.verified,
      Economic_Sector: user.Economic_Sector,
      phone_number: user.phone_number,
      notificationFollowing: user.notificationFollowing,
      notificationAll: user.notificationAll,
      notificationComment: user.notificationComment,
      notificationReact: user.notificationReact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
