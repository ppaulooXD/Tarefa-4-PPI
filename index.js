import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const porta = 3000;
const host = '0.0.0.0';

var usuarios= [];

function listausuarios(requisicao, resposta){

    let contresposta = '';

    if(!(requisicao.body.nome && requisicao.body.sobrenome && requisicao.body.username)){

        contresposta = `
                <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Cadastro</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                </head>
                <body>  
                    <form action="/cadastro" method="POST" class="row g-3 needs-validation" novalidate>
                        <fieldset class="border p-2">
                        <legend>Cadastro</legend>
                        <div class="col-md-4">
                            <label for="nome" class="form-label">Nome</label>
                            <input type="text" class="form-control" id="nome" name="nome" value="${requisicao.body.nome}" required>
                        </div>`;

        if(!requisicao.body.nome){
            contresposta+=`
                        <div>
                            <p class="text-danger">O campo nome deve ser preenchido</p>
                        </div>`;
        }

        contresposta+=`
                        <div class="col-md-4">
                            <label for="sobrenome" class="form-label">Sobrenome</label>
                            <input type="text" class="form-control" id="sobrenome" name="sobrenome" value="${requisicao.body.sobrenome}" required>
                        </div>`;

        if(!requisicao.body.sobrenome){
            contresposta+=`
                        <div>
                            <p class="text-danger">O campo sobrenome deve ser preenchido</p>
                        </div>`;
        }

        contresposta+=`
                        <div class="col-md-4">
                            <label for="username" class="form-label">Nome de Usuário:</label>
                            <div class="input-group has-validation">
                                <span class="input-group-text" id="inputGroupPrepend">@</span>
                                <input type="text" class="form-control" id="username" name="username" aria-describedby="inputGroupPrepend" value="${requisicao.body.username}" required>
                            </div>
                        </div>
        `;

        if(!requisicao.body.username){
            contresposta+=`
                        <div>
                            <p class="text-danger">O campo nome de usuário deve ser preenchido</p>
                        </div>`;
        }

        contresposta+=`
                        <div class="col-12">
                            <button class="btn btn-primary mt-4" type="submit">Cadastrar</button>
                        </div>
                        </fieldset>
                        </form>
    
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
                        </body>
                        </html>`;

        resposta.end(contresposta);
    }
    else{
        const usuario = {
            nome: requisicao.body.nome,
            sobrenome: requisicao.body.sobrenome,
            username: requisicao.body.username
        }
        usuarios.push(usuario);

        contresposta =`
                    <!DOCTYPE html>
                    <html lang="pt-br">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Lista de usuários</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">    
                    </head>
                    <body>
                    <h1>Lista de usuários</h1>
                    <table class="table table-dark table-striped">
                        <thead>
                            <tr>
                            <th scope="col">Nome</th>
                            <th scope="col">Sobrenome</th>
                            <th scope="col">Username</th>
                            </tr>
                        </thead>
                        <tbody>                      
        `;
        for(const usuario of usuarios)
        {
            contresposta += `
                <tr>    
                    <td>${usuario.nome}</td>
                    <td>${usuario.sobrenome}</td>
                    <td>${usuario.username}</td>
                </tr>
            `
        }
        contresposta += `
                        </tbody>
                    </table>
                    <a class="btn btn-light" href="/" role="button">Voltar ao menu</a>
                    <a class="btn btn-success" href="/cadastro.html" role="button">Cadastrar</a>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
                    </body>
                    </html>`;

        resposta.send(contresposta);
    }
                
}

function autenticacao(requisicao, resposta, next){
    if(requisicao.session.usuarioLogado){
        next();
    }
    else{
        resposta.redirect('/login.html');
    }
}

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'páginas')));
app.use(session({
    secret: "Chav3S3cr3ta",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 15
    }
}))

app.get('/',autenticacao, (requisicao, resposta) => {
    const ultimoacesso = requisicao.cookies.ultimoacesso;
    const data = new Date();
    resposta.cookie("ultimoacesso", data.toLocaleString(),{
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
    });

    resposta.end(`
                <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Menu de escolha</title>
                    <style>
                        * {
                            font-family: Verdana;
                        }
                        .container {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: column;
                            width: 350px;
                            height: 350px;
                            border: 1px solid black;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            border-radius: 5px;
                        }
                        .a {
                            text-decoration: none;
                            background-color: black;
                            color: white;
                            border-radius: 5px;
                            padding: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Menu</h1><br>
                        <a class= "a" href="/cadastro.html">Cadastrar</a>
                        </br>
                        <p style=" margin-top: 50px;font-family: Verdana" >Último acesso: ${ultimoacesso}</p>
                    </div>
                </body>
                </html>       
    `);
})

app.post('/login', (requisicao, resposta) => {
     const usuario = requisicao.body.usuario;
     const senha = requisicao.body.senha;

     if(usuario &&  senha && (usuario == "paulo") && (senha == "paulo")){
        requisicao.session.usuarioLogado = true;
        resposta.redirect('/');
     }
     else{
        resposta.end(
            `<!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Erro</title>
            </head>
            <body>
                <h1 style="color: red; text-align: center; font-family: Verdana">Usuário ou senha inválidos</h1>
                </br>
                <div style="text-align: center">
                    <a style="font-family: Verdana; text-decoration: none" href="/login.html">Voltar</a>
                </div>
            </body>
            </html>
        `);
     }
})

app.post('/cadastro',autenticacao, listausuarios);

app.listen(porta, host, () => {
    console.log(`Servidor rodando na url http://${host}:${porta}`);
});