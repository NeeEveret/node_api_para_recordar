const express = require('express');
const app = express();
const port =3000
const cors = require("cors");

app.use(cors()); // 🔥 Permite peticiones desde cualquier origen

// Dominios permitidos
const allowedOrigins = [
  "http://localhost:3000",  // tu React en desarrollo
  "https://mi-frontend.vercel.app", // tu frontend en producción (ajusta el dominio real)
  "http://localhost:3000/deploy1"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS,lo siento manin"));
    }
  }
}));

app.get('/', (req, res) =>{
    res.send('index page, gaaaa!')
    res.send("API funcionando 🚀");
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
    
    res.json({"randomNumber": result})
    res.send(result)
})


app.listen(port,() => {
    console.log("server on port "+port+" ,si");
    
})