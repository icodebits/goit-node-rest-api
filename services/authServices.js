import User from "../db/models/User.js";

async function registerUser(email, password, avatarURL) {
    const user = await User.create({ email, password, avatarURL });
    return user;
}

async function getUser(email) {
    return await User.findOne({ where: { email } });
}

async function getUserById(userId) {
    return await User.findByPk(userId);
}

async function updateUserToken(userId, token) {
    return await User.update({ token }, { where: { id: userId } });
}

async function updateUserAvatar(userId, avatarURL) {
    return await User.update({ avatarURL }, { where: { id: userId } });
}

export default { registerUser, getUser, getUserById, updateUserToken, updateUserAvatar };