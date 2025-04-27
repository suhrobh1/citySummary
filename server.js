// import OpenAI from 'openai';
// import dotenv from  'dotenv';

// dotenv.config();

// const key = process.env.apiKey

// const openai = new OpenAI({
//   apiKey: key,
//   baseURL: 'https://integrate.api.nvidia.com/v1',
// })

// async function main() {
//   const completion = await openai.chat.completions.create({
//     model: "nvidia/llama-3.3-nemotron-super-49b-v1",
//     messages: [{"role":"system","content":"couple of sentences on Berlin"}],
//     temperature: 0.6,
//     top_p: 0.95,
//     max_tokens: 4096,
//     frequency_penalty: 0,
//     presence_penalty: 0,
//     stream: true,
//   })
   
//   for await (const chunk of completion) {
//     process.stdout.write(chunk.choices[0]?.delta?.content || '')
//   }
  
// }

// main();


  import OpenAI from 'openai';
  import dotenv from  'dotenv';
  import express from 'express';
  import cors from 'cors';
  import axios from 'axios';

  const app = express();
  app.use(express.json());
  app.use(cors());
  
  dotenv.config();



  
  const key = process.env.apiKey

 let sendMessage = "";

app.post("/summary", async (req,res) => {

  const {city, latitude, longitude} = req.body;

  

  if (city){
    sendMessage = [{ "role": "system", "content": `couple of sentences on ${city}` }]
  }else{
    sendMessage = [{ "role": "system", "content": `Please provide the following for area in latitude ${latitude} and longitude ${longitude}. These are the details that are needed: 
Location, Nearest Town, Geographical Features, Land Use/Landscape, Recreational Opportunities, Nearest Larger Urban Center, Climate. One sentence for each.` }]
  }



  console.log("In summary microservice!");



 const openai = new OpenAI({
    apiKey: key,
    baseURL: 'https://integrate.api.nvidia.com/v1',
  })
  
  try {
  
    const completion = await openai.chat.completions.create({
      model: "nvidia/llama-3.3-nemotron-super-49b-v1",
      messages: sendMessage,
      temperature: 0.6,
      top_p: 0.95,
      max_tokens: 4096,
      frequency_penalty: 0,
      presence_penalty: 0,
      // stream: true,  <-- remove or set to false
    });
  


    let summary = completion.choices[0].message.content;

    console.log("Message from AI: ", summary);

    res.status(200).json({summary});

  } catch (error) {
    console.error("Error fetching places:", error.message);
    res.status(500).json({ error: "Failed to fetch places of interest" });
  }







});

  
 
  


  const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`places microservice running on port ${PORT}`);
    });
