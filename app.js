
// 🐀🐁
import fetch from "node-fetch";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import natural from "natural";
import 'dotenv/config'; 
import { VertexAI } from "@google-cloud/vertexai";
//Esto es ESM carga las variables de entorno// o require('dotenv').config() pero es para CommonJS
const app = express();
const port = 4000;
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

//rutas
app.get('/', (req, res) =>{
    res.send('index page, gaaaa!🚀')
})
app.get('/random/:numeroInicial/:numeroFinal', (req,res) =>{
    const min = parseInt(req.params.numeroInicial)
    const max = parseInt(req.params.numeroFinal)
    if (isNaN(min) || isNaN(max)){
        res.status(404).json({"error":'Bad request-Peticion Incorrecta'})
        return;
    }

    const result = Math.floor(Math.random() * (max - min) + min)
    // res.json({"randomNumber": result})
    res.send(result.toString())
    //deberia recibir el texto y la configuracion en un json para luego recien mandarlo a la api

})

app.post('/teto', async (req,res) =>{   //recibe el json con datos y config para pasarlo a la api de google
  console.log("req es");
  
  console.log(req.body);
  
  const API_KEY =process.env.GOOGLE_API_KEY;  //traer la key de una variable de entorno
  const laUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`
  
  const data = req.body;  //data agota tiene el json  con input, voice y audioConfig para enviar a la api de Google
  const textoParaUsar = data.input.text   //el texto que se usara para grabar
  
  // Tokenizador por oraciones//  al enviar textos largos la api se trava
  //igual pasa en la prueba que da google, a veces no carga lo que envias y  demora. O graba mal
  const tokenizer = new natural.SentenceTokenizer();  
  const oraciones = tokenizer.tokenize(textoParaUsar);// el texto en oraciones, asi que habra varias oraciones
  ///////////////////
  // (async () => {
  //   const res = await fetch(`https://texttospeech.googleapis.com/v1/voices?key=${API_KEY}`);
  //   const data = await res.json();
  //   console.log(data);
  // })();
  /////////////////
  // const API_KEY = "AIzaSyCkl*****"//la key la invocare desde un archivo local que no se sube al repositorio
                                    //en el host estara como variable de entorno con el mismo dato

  //modificar el json que enviaron para tokenizar los textos, que ahora estan en "oraciones"
  const audios = []; //aqui se guardaran todos las oraciones "grabadas" a base64
                      //lo que mande la api de google
  
  
  for (const oracion of oraciones) {
    //texto tendra un array con varias oraciones a mandar a grabar
    const dataJSON = {...data}; //data es tipo object
    dataJSON.input.text =oracion //modificarel contenido del json, para que tenga la oracion de texto  
    try {
      const respuesta = await fetch(laUrl,{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(dataJSON)
      })
      const dataRes = await respuesta.json()  //aqui se guardará la respuesta de la APIgoogle
      console.log("la respuesta es ",dataRes);
      
      if(dataRes.audioContent){ //dataRes.audioContent es type Base64
        audios.push(dataRes.audioContent) //dataRes.audioContent //string
      }
    } catch (error) {
      return res.status(500).json({ error: "🐀Error en TTS🐁" });
    }
  }

  // res.json({
  // mensajeeee: "✅ Audios generados",
  // audios:audios, // el array de audios en base64
  // });
//////////////////////////////////////////////////////////////
 

  res.json({
  mensajeeee: "✅ Audios generados",
  audios:audios, // el array de audios en base64
  });
//////////////

})



app.listen(port,() => {
    console.log(`server on port${port},si🚀`);
    
})