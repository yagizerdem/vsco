const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  base64: String,
  commentIdList: {
    type: Array,
    default: [],
  },
  likeIdList: {
    type: Array,
    default: [],
  },
  userId: String,
  createdAt: Date,
  showComments: Boolean,
  postName: String,
});
schema.pre("save", async function (next) {
  // Get the current date
  const currentDate = new Date();

  // Extract individual components of the date
  const year = currentDate.getFullYear(); // Full year (e.g., 2022)
  const month = currentDate.getMonth() + 1; // Month (0-11, so add 1 to get 1-12)
  const day = currentDate.getDate(); // Day of the month (1-31)
  const hours = currentDate.getHours(); // Hours (0-23)
  const minutes = currentDate.getMinutes(); // Minutes (0-59)

  // Create a readable format
  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")} ${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  // console.log(formattedDate);
  this.createdAt = formattedDate;
  next();
});
const SinglePost =
  mongoose.models.SinglePost || mongoose.model("SinglePost", schema);

export default SinglePost;
