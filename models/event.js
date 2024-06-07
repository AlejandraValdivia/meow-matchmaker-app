const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventFormSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: {
      type: String,
      validate: {
        validator: function (v) {
          return /\d{3}-\d{3}-\d{4}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      required: [true, "Your phone number is required"],
    },
    location: { type: String, required: true },
    eventDate: { type: Date, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const EventForm = mongoose.model(
  "EventForm",
    eventFormSchema );

module.exports = EventForm;
