//https://www.luiztools.com.br/post/api-gateway-em-arquitetura-de-microservices-com-node-js/
//index.js
const httpProxy = require('express-http-proxy');
const express   = require('express');
const app       = express();
var logger      = require('morgan');

app.use(logger('dev'));

/*  A parte de mapeamento das URLs é o mesmo padrão do Express, mas aqui o segredo
    está na função selectProxyHost, onde eu defino com base no path recebido, a URL
    de destino. Querendo tornar essa função dinâmica, recomendo salvar as regras de
    roteamento como chave-valor em um banco Redis que é muito rápido e excelente para
    esta finalidade. */

function selectProxyHost(req) {
    if (req.path.startsWith('/movies'))
        return 'http://localhost:3000/';
    else if (req.path.startsWith('/cinemas'))
        return 'http://localhost:3001/';
    else if (req.path.startsWith('/customer'))
        return 'http://localhost:5000/customer';
}

// expressjs.com/pt-br/starter/faq.html
app.use('/favicon.ico', function(req, res, next) {
    res.status(404).send('Sorry cant find that!')
})

app.use((req, res, next) => {
    httpProxy(selectProxyHost(req))(req, res, next);
});

/*  As duas últimas linhas criam o servidor HTTP para que ele passe a escutar na porta
    10000, deixando as demais para os micro serviços que serão roteados por esse
    API Gateway, que será a rota default de todos os fronts da sua aplicação. */

app.listen(10000, () => {
    console.log('API Gateway running!');
});