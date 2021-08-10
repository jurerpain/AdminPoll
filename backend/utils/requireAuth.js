

const RequireAuth = (req) => {
    if (!req.session.user){
        return false
    }
    return false
}
module.exports = RequireAuth;