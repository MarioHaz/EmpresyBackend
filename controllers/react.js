const React = require("../models/React");
const User = require("../models/User");
const Post = require("../models/Post");
const { sendEmail } = require("../helpers/mailer");

newMessageTemplate = () => {
  return `
  <div
  style="
    display: flex;
    margin-bottom: 1rem;
    max-width: 100%;
    align-items: center;
    gap: 10px;
    font-family: sans-serif;
    font-weight: 600;
    color: #36b1ff;
    justify-content: center;
  "
>
  <span>
    <strong>Haz recibido un "me gusta": revisa tu perfil en empresy</strong>
  </span>
</div>

<div
  style="
    padding: 1rem 0;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    color: #141823;
    font-size: 17px;
    font-family: sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  "
>
  <img
    width="170px"
    src="http://cdn.mcauto-images-production.sendgrid.net/9f8beee71c0a1d98/dbf12818-bf74-4d8a-ba31-7ef82f312458/4015x1200.png"
    alt=""
  />
  <div style="padding: 20px">
    <span>
      Tu publicación ha sido un exito, revisa quien ha dado "me gusta" en tu
      cuenta de empresy.
    </span>
  </div>

  <a
    href="https://empresy.com"
    style="
      width: 200px;
      padding: 10px 15px;
      background-color: #36b1ff;
      color: #fff;
      text-decoration: none;
      font-weight: 600;
      border-radius: 10px;
      text-align: center;
    "
  >
    Ir a empresy </a
  ><br />

  <div style="padding: 20px">
    <span style="font-size: 12px; color: #898f9c">
      Empresy te permite mantener contacto con otras empresas. Una vez
      registrado en Empresy, podrás compartir tus productos, contactar
      proveedores y mucho más.
    </span>
  </div>
</div>`;
};

exports.reactPost = async (req, res) => {
  try {
    const reactBy = req.user.id;

    const { postId, react } = req.body;

    const check = await React.findOne({
      postRef: postId,
      reactBy: req.user.id,
    });

    const post = await Post.findById(postId);

    if (check == null) {
      const newReact = new React({
        react: react,
        postRef: postId,
        reactBy: req.user.id,
      });

      await newReact.save();

      await User.findByIdAndUpdate(post.user, {
        $push: {
          notificationReact: {
            type: "react", // Add the type to differentiate between notifications
            user: req.user.id,
            createdAt: new Date(),
            postRef: postId,
          },
        },
      });
      await User.findByIdAndUpdate(post.user, {
        $push: {
          notificationAll: req.user.id,
        },
      });
      const userPost = await User.findById(post.user);
      console.log(userPost.email);
      sendEmail(
        userPost.email,
        "Una empresa se ha interesado en ti! - Haz recibido un Like en tu publicación!",
        newMessageTemplate()
      );

      res.json("added");
    } else {
      if (check.react == react) {
        await React.findByIdAndRemove(check._id);
        res.json("removed");
      } else {
        await React.findByIdAndUpdate(check._id, {
          react: react,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getReacts = async (req, res) => {
  try {
    const reactsArray = await React.find({ postRef: req.params.id });

    const newReacts = reactsArray.reduce((group, react) => {
      let key = react["react"];
      group[key] = group[key] || [];
      group[key].push(react);
      return group;
    }, {});
    const reacts = [
      {
        react: "like",
        count: newReacts.like ? newReacts.like.length : 0,
      },
      {
        react: "love",
        count: newReacts.love ? newReacts.love.length : 0,
      },
      {
        react: "haha",
        count: newReacts.haha ? newReacts.haha.length : 0,
      },
      {
        react: "sad",
        count: newReacts.sad ? newReacts.sad.length : 0,
      },
      {
        react: "wow",
        count: newReacts.wow ? newReacts.wow.length : 0,
      },
      {
        react: "angry",
        count: newReacts.angry ? newReacts.angry.length : 0,
      },
    ];

    const check = await React.findOne({
      postRef: req.params.id,
      reactBy: req.user.id,
    });
    const user = await User.findById(req.user.id);
    const checkSaved = user?.SavedPosts.find(
      (x) => x.post.toString() === req.params.id
    );
    res.json({
      reacts,
      check: check?.react,
      total: reactsArray.length,
      checkSaved: checkSaved ? true : false,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
