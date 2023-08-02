//COntroller LOgin & Signup
const signup_get = (req, res)=> {
    res.render('signup');
}

const login_get = (req, res)=> {
    res.render('login');
}

const signup_post = (req, res)=> {
    res.send('New Sign up')
}

const login_post = (req, res)=> {
    res.send('New Login')
}

module.exports = {
    signup_get,
    signup_post,
    login_get,
    login_post
}