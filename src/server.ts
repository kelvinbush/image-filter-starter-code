import express from 'express';
import bodyParser from 'body-parser';
import {deleteLocalFiles, filterImageFromURL} from './util/util';

(async () => {
  
  // Init the Express application
  const app = express();
  
  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  app.get("/filteredimage", async (req, res) => {
    let {image_url} = req.query as { image_url: string };
    if (!image_url) {
      res.status(400).send("Image URL is required");
    }
    try {
      const filteredPath = await filterImageFromURL(image_url);
      res.sendFile(filteredPath, () => {
        deleteLocalFiles([filteredPath]);
      });
    } catch (error) {
      res.status(422).send("Could not process image please try another");
    }
  });
  
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });
  
  
  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
