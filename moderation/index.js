const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const handleEvent = async (type, data) => {
  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";
    await axios.post("http://localhost:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      },
    });
  }
};

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({});
});
app.listen(4003, async () => {
  console.log("Listening on 4003");

  await axios.get("http://localhost:4005/events").then((res) => {
    for (let event of res.data) {
      console.log("Processing event:", event.type);
      handleEvent(event.type, event.data);
    }
  });
});
