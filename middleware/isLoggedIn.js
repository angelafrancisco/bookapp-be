module.exports = ((req, res, next) => {
    if (req.session.isloggedIn) {
        next()
    } else {
        console.log(err)
    }
});