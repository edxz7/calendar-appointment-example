module.exports = (req, res, next) => {
    if (!req.session.currentUser) {
        req.app.locals.isLoggedIn = false;
        return res.redirect("/");
    }
    const { role, name } = req.session.currentUser;
    console.log('role: ', role) 
    console.log('name: ', name) 
    if(role === 'User') {
        req.app.locals.isUser = true
        next()
    } else {
        req.app.locals.isUser = false
        res.redirect('/calendar')
    }
    console.log('req.app.locals.isUser: ', req.app.locals.isUser);

}