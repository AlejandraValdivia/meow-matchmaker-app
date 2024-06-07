const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicationFormSchema = new Schema(
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
    origin: { type: String },
    services: {
      type: String,
      enum: ["adopt", "fosterCare", "volunteer", "rentMe"],
      required: true,
    },
    message: { 
      success: String,
      error: String
     },
  },
  { timestamps: true }
);

const ApplicationForm = mongoose.model(
  "ApplicationForm",
  applicationFormSchema
);

module.exports = ApplicationForm;
