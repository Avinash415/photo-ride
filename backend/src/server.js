import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5001;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
