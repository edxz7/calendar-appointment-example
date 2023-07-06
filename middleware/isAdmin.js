module.exports = (req, res, next) => {
    const { role } = req.session.currentUser;
    console.log('role: ', role) 
    if(role === 'Admin') {
        req.app.locals.isAdmin = true
    } else {
        req.app.locals.isAdmin = false
    }
    console.log('req.app.locals.isAdmin: ', req.app.locals.isAdmin);
    next()
}