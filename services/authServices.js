import User from "../db/models/User.js";

async function registerUser(email, password) {
    const user = await User.create({ email, password });
    return user;
}

async function getUser(email) {
    return await User.findOne({ where: { email } });
}

async function updateUserToken(userId, token) {
    return await User.update({ token }, { where: { id: userId } });
}

export default{ registerUser, getUser, updateUserToken };