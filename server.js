const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

let listaNegra = ['ejemplo@gmail.com']; 

app.get('/', (req, res) => {
    res.render('index', { mensaje: null, verContenido: false });
});

app.post('/acceder', (req, res) => {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
    if (!email) return res.render('index', { mensaje: 'Ingresa tu correo.', verContenido: false });
    if (listaNegra.includes(email)) {
        return res.render('index', { mensaje: 'Acceso denegado. Has sido expulsado.', verContenido: false });
    }
    res.render('index', { mensaje: `Bienvenido, ${email}`, verContenido: true });
});

app.post('/bloquear-correo', (req, res) => {
    const emailABloquear = req.body.emailAdmin ? req.body.emailAdmin.trim().toLowerCase() : '';
    if (emailABloquear && !listaNegra.includes(emailABloquear)) listaNegra.push(emailABloquear);
    res.redirect('/');
});

app.listen(PORT, () => console.log(`Puerto ${PORT}`));