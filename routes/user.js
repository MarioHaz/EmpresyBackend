const express = require("express");
const {
  register,
  activateAccount,
  login,
  auth,
  sendVerification,
  findUser,
  sendResetPasswordCode,
  validateResetCode,
  changePassword,
  getProfile,
  updateProfilePicture,
  updateCover,
  updateAbout,
  addFriend,
  cancelRequest,
  unfollow,
  follow,
  acceptRequest,
  unfriend,
  deleteRequest,
  search,
  refreshtoken,
  addToSearchHistory,
  getSearchHistory,
  removeFromSearch,
  removeNotifications,
  searchVisitor,
  getFollowers,
  getNotifications,
  getConversation,
  logeduser,
  getNewMessages,
  getProfileVisitor,
} = require("../controllers/register");
const { authUser } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/activate", authUser, activateAccount);
router.post("/login", login);
router.post("/sendVerification", authUser, sendVerification);
router.post("/findUser", findUser);
router.post("/sendResetPasswordCode", sendResetPasswordCode);
router.post("/validateResetCode", validateResetCode);
router.post("/changePassword", changePassword);
router.post("/refreshtoken", refreshtoken);
router.get("/getProfile/:username", authUser, getProfile);
router.get("/getProfileVisitor/:username", getProfileVisitor);
router.put("/updateProfilePicture", authUser, updateProfilePicture);
router.put("/updateCover", authUser, updateCover);
router.put("/updateAbout", authUser, updateAbout);
router.put("/addFriend/:id", authUser, addFriend);
router.put("/cancelRequest/:id", authUser, cancelRequest);
router.put("/follow/:id", authUser, follow);
router.put("/unfollow/:id", authUser, unfollow);
router.put("/acceptRequest/:id", authUser, acceptRequest);
router.put("/unfriend/:id", authUser, unfriend);
router.put("/deleteRequest/:id", authUser, deleteRequest);
router.post("/search/:searchTerm", authUser, search);
router.put("/addToSearchHistory", authUser, addToSearchHistory);
router.get("/getSearchHistory", authUser, getSearchHistory);
router.put("/removeFromSearch", authUser, removeFromSearch);
router.put("/removeNotifications", authUser, removeNotifications);
router.post("/searchVisitor/:searchTerm", searchVisitor);
router.get("/getFollowers", authUser, getFollowers);
router.get("/getNotifications", authUser, getNotifications);
router.get("/logeduser", authUser, logeduser);
router.get("/getNewMessages", authUser, getNewMessages);

module.exports = router;
