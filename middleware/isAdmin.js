module.exports = (req, res, next) => {
    if (!req.session.currentUser) {
        req.app.locals.isLoggedIn = false;
        return res.redirect("/");
    }
    const { role } = req.session.currentUser;
    console.log('role: ', role) 
    if(role === 'Admin') {
        req.app.locals.isAdmin = true
        next()
    } else {
        req.app.locals.isAdmin = false
        console.log('req.app.locals.isAdmin: ', req.app.locals.isAdmin);
        res.redirect('/owner/list')
    }
}