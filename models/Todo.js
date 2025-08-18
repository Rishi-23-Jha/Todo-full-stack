import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Todo || mongoose.model("Todo", TodoSchema);
