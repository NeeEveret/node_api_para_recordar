const express = require('express');
const app = express();
const port =4000
const cors = require("cors");
const fs = require("fs");
const path = require("path"); 
const natural = require("natural");


// Dominios permitidos
const allowedOrigins = [
  "http://localhost:3000",  // tu React en desarrollo
  "https://mi-frontend.vercel.app", // tu frontend en producción (ajusta el dominio real)
  "http://localhost:3000/deploy1",
  "http://localhost:4000/deploy1",
  "http://localhost:4000/teto",
  "http://localhost:4000/teto",
  "http://localhost:3000/deploy1"
];


 // 🔥 Permite peticiones desde cualquier origen

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS,lo siento manin"));
    }
  }
}));
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('index page, gaaaa!🚀')
})
app.get('/random/:numeroInicial/:numeroFinal', (req,res) =>{
    console.log(req.params.numeroInicial);
    console.log(req.params.numeroFinal);
    const min = parseInt(req.params.numeroInicial)
    const max = parseInt(req.params.numeroFinal)
    if (isNaN(min) || isNaN(max)){
        res.status(404)
        res.json({"error":'Bad request-Peticion Incorrecta'})
        return;
    }
    const result = Math.floor(Math.random() * (max - min) + min)
    
    // res.json({"randomNumber": result})
    res.send(result)

    //deberia recibir el texto y la configuracion en un json para luego recien mandarlo a la api

})

app.post('/teto', async (req,res) =>{
  // const datosReq=req.params //aqui estaria el json para mandarlo a grabar
  // console.log("Datos recibidos:", req.body);

  // // aquí podrías llamar a Google TTS con tu API_KEY guardada en el servidor
  // // por ahora respondemos algo de prueba
  // res.json({
  //   status: "ok, todo bien pelucon",
  //   recibido: req.body
  // });
  const data = req.body;
  const textoParaUsar = data.input.text
  
  // Tokenizador por oraciones// tokenizo porque al enviar textos largos a veces la api se trava
  //igual pasa en la prueba que da google, a veces no carga lo que envias y asi  7-7 
  const tokenizer = new natural.SentenceTokenizer();  
  const oraciones = tokenizer.tokenize(textoParaUsar);
  console.log("Oraciones detectadas:", oraciones);
  
  // supongamos que ya tienes el audio en base64 (audioContent)
  // const audioContent = "UklGRiQAAABXQVZFZm10..." // <-- ejemplo
  
  // res.json({
  //   mensaje: "✅ Audio generado, pésssssssss.RATON!",
  //   audio: audioContent,
  //   cositas:data.input.text,
  //   ladata:data
  // });

  //////////////////
  // Tu API Key de Google Cloud (creada en la consola)
  const API_KEY = "AIzaSyCkl0YsqvMeIC6SetNCErKfA-pmhFaiufY"
  //Endpoint de la API
  const laUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`
  //data agota tiene el json  con input, voice y audioConfig para enviar a la api de Google
  //modificar el json que enviaron para tokenizar los textos, que ahora estan en "oraciones"
  const audios = [];
  console.log("oraciones es:",oraciones);
  
  
  for (const indexTextos of oraciones) {
    //texto tendra un array con varias oraciones a mandar a grabar
    const dataJSON = {...data}; //data es tipo object
    dataJSON.input.text =indexTextos //modificarel contenido del json, para que tenga la oracion de texto  

    try {
      const respuesta = await fetch(laUrl,{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(dataJSON)
      })
      const dataRes = await respuesta.json()
      if(dataRes.audioContent){
        // El resultado viene en Base64
        // console.log("audioBase64 es tipo",typeof audioBase64);
        // console.log("data es tipo",typeof data);
        // res.send(console.log("Audio Base64:", audioBase64))
        // res.send(dataRes) //aqui envio el objeto que me envia la api de google
        //en data.audioContent esta el texto en base64
        audios.push((dataRes.audioContent)) //dataRes.audioContent //string
      }
    } catch (error) {
      // resError=console.error("Hay un error y es :", data)
      // res.send(resError)
      console.error("Error en TTS:", error);
    }
  }
  res.json({
  mensaje: "✅ Audios generados",
  audios // array de audios en base64, cada uno corresponde a una oración
});
})



app.listen(port,() => {
    console.log("server on port "+port+" ,si");
    
})