const express = require('express');
const app = express();
const port =3000


app.get('/', (req, res) =>{
    res.send('index page, gaaaa!')
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