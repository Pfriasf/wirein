const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://wiredinadmin:jbbtU8Db50gNBnEZ@cluster0.covy2.mongodb.net/wiredin?retryWrites=true&w=majority" ||
      "mongodb://localhost/wiredin",
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

process.on("SIGINT", () => {
  mongoose.connection
    .close()
    .then(() => console.log("Successfully disconnected from the DB"))
    .catch((e) => console.error("Error disconnecting from the DB", e))
    .finally(() => process.exit());
});
