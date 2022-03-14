const Message = require("../../models/MessageModel");

module.exports = {
  Mutation: {
    async createMessage(_, { messageInput: { text, username } }) {
      const newMessage = new Message({
        text: text,
        createdBy: username,
        createdAt: new Date().toISOString(),
      });

      const res = await newMessage.save();
      return {
        id: res.id,
        ...res._doc,
      };
    },
  },

  Query: {
    message: (_, { id }) => Message.findById(id),
  },
};
