import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import authServices from "../services/authServices.js";

const authMiddleware = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) {
       return next(HttpError(401, "Not authorized"));
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRET_KEY);
        const user = authServices.getUserById(id)
            .then((user) => {
                if (!user || user.token !== token) {
                    return next(HttpError(401, "Not authorized"));
                }
                
                req.user = user;
                next();
            })
            .catch((error) => console.log(error));
    } catch (error) {
        return next(HttpError(401, "Not authorized"));
    }
};

export default authMiddleware;