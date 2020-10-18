const router = require('express').Router();
const User = require('./model/User.js');
const bcrypt = require('bcryptjs')
var path = require('path');
const jwt = require('jsonwebtoken');
const {RegisterValidation, LoginValidation} = require('./validation');
const verify = require('./privateRoutes');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');


dotenv.config();


// const TWO_HOURS = 1000 * 60 * 60 * 2;

// app.use(session({
//     name: process.env.SESS_NAME,
//     resave : false,
//     saveUninitialized: false,
//     secret: process.env.SESS_SECRET,
//     cookie: {
//       maxAge: TWO_HOURS,
//       sameSite: true,
//       secure: 'production',
//     }
//   }));


//user database Routes -----------------------------

// const schema = Joi.object(
// {
//     name: Joi.string().min(6).required(),
//     email: Joi.string().min(6).required().email(),
//     password: Joi.string().min(6).required()
// });

router.get('/login', (req, res) => 
{
  res.sendFile(path.resolve(`${__dirname}/homepage/login.html`))
}) 
router.get('/register', (req, res) => 
{
  res.sendFile(path.resolve(`${__dirname}/homepage/register.html`))
}) 

router.get('/', (req, res) =>
{
  res.sendFile(path.resolve(`${__dirname}/homepage/homepage.html`));
})

// router.get('/apiTest', (req,res)=> {
//     console.log('request made from React');
//     res.send("API is working good");
// });

//REGISTRATION
router.post('/register', async(req, res) =>
{
    const {error} = RegisterValidation(req.body);
    if(error) return res.status(400).send([error.details[0].message]);
    
    const emailExist = await User.findOne({ email: req.body.email});
    if(emailExist) return res.status(400).send(['Email already exist']);

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //Add new user to data base
    const user = new User
        ({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        });
    try 
    {
	    const savedUser = await user.save();
        // res.send([savedUser.id]); 
        //Make this get session Token and login when register
        const token = jwt.sign({_id: savedUser.id}, process.env.TOKEN_SECRET);
        res.writeHead(res.statusCode);
        res.write(JSON.stringify([token]));
        res.end();
        console.log(`User ${req.body.name} has been registered`);
        
        
    } 
    catch(err) 
    {
	    res.status(400).send(err);
    }

});

//LOGIN
router.post('/login', async (req, res) => 
{
    const {error} = LoginValidation(req.body);
    if(error) return res.status(400).send([error.details[0].message]);
    //Check if email exist 
    const user = await User.findOne({ email: req.body.email});
    if(!user) return res.status(400).send(['Email or password is wrong']);
    //PASSWORD CHECK
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send(['Email or password is wrong']);
    //Create and assign a token
    const token = jwt.sign({_id: user.id}, process.env.TOKEN_SECRET);
    res.writeHead(res.statusCode);
    res.write(JSON.stringify([token]));
    res.end();
    // res.header('auth-token', token).send([token]);
})

router.post('/getUserWithId', async(req, res) =>
{
    const user = await User.findOne({_id: req.body.id});
    if(!user) return res.status(400).send(['something went wrong']);

    res.send([user]);
})

router.post('/getUserWithEmail', async(req, res) =>
{
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send(['something went wrong']);

    res.send(user);
})

router.get('/getUserInfo',verify, async(req, res) => 
{
    const user = await User.findOne({ _id: req.user._id});
    res.send([user]);
})

//cookies -------------------------------------------------



//Game routes----------------------------------------------


router.get('/game', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/game/main.html`));
})

router.get('/game', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/game/main.html`));
})

router.get('/ray.js', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/game/ray.js`))
})

router.get('/boundary.js', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/game/boundary.js`))
})

router.get('/particle.js', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/game/particle.js`))
})

router.get('/canvas.js', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/game/canvas.js`))
})



module.exports = router;