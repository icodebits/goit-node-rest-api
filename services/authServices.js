import User from "../db/models/User.js";

async function registerUser(email, password) {
    const user = await User.create({ email, password });
    return user;
}

export default{ registerUser };