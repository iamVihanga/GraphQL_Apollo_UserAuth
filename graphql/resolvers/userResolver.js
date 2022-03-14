const User = require("../../models/UserModel");
const { ApolloError } = require("apollo-server-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  Mutation: {
    // Register user mutation
    async registerUser(_, { registerInput: { username, email, password } }) {
      // Check if old user already exsist with passed email
      const oldUser = await User.findOne({ email });

      // Throw error if user exsists with email
      if (oldUser) {
        throw new ApolloError(
          "User already exsist with this email " + email,
          "USER_ALREADY_EXSISTS"
        );
      }

      //  Encrypt password
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Create mongoose model
      const newUser = new User({
        username: username,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });

      // Create JWT (to attach token of user model)
      const token = jwt.sign({ user_id: newUser._id, email }, "UNSAFE_STRING", {
        expiresIn: "2h",
      });
      newUser.token = token;

      // Save user in mongoDB
      const res = await newUser.save();

      return {
        id: res.id,
        ...res._doc,
      };
    },

    // Login user mutation
    async loginUser(_, { loginInput: { email, password } }) {
      // see if a user exsits with the email
      const user = await User.findOne({ email });

      // if user dosent exsits return error
      if (!user) {
        throw new ApolloError("User not found", "UNREGISTERED_USER");
      }

      // check if the entered password equals to encrypted password
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create a new token
        const token = jwt.sign({ user_id: user._id, email }, "UNSAFE_STRING", {
          expiresIn: "2h",
        });

        // Attach token to user model that found above
        user.token = token;

        return {
          id: user.id,
          ...user._doc,
        };
      } else {
        throw new ApolloError("Incorrect password", "INCORRECT_PASSWORD");
      }
    },
  },

  Query: {
    user: (_, { ID }) => User.findById(ID),
  },
};
