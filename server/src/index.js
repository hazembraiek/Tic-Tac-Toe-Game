import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
const app = express();

app.use(cors());
app.use(express.json());
const api_key = "2qh9udybds4t";
const api_secret =
  "nenj6zh59dtpwawc5k3gq7jtvbjd32feec56fkgz32fcypuxge74acprdn5rbn8c";
const Client_server = StreamChat.getInstance(api_key, api_secret);

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    const userId = uuidv4();
    const HashedPassword = await bcrypt.hash(password, 10);

    const Token = Client_server.createToken(userId);
    res.status(200).json({
      status: "success",
      data: {
        user: {
          userId,
          firstName,
          lastName,
          username,
          password: HashedPassword,
          Token,
        },
      },
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { users } = await Client_server.queryUsers({ name: username });
    if (users.length === 0) {
      return res.status(404).json("User Not Found");
    }

    const Token = Client_server.createToken(users[0].id);
    console.log(users[0].password);
    const PasswordMatch = await bcrypt.compare(password, users[0].password);
    if (!PasswordMatch && users[0].password !== password) {
    
      return res.status(404).json("Password Not Found");
    }
    res.status(200).json({
      status: "success",
      user: {
        Token,
        username,
        userId: users[0].id,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
      },
    });
  } catch (err) {

    res.status(404).json(err.message);
  }
});
app.listen(8000, () => {
  console.log("app Runing on port 8000...");
});
