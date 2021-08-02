function searchUser ( id, users ) {
    const index =  users.findIndex((item) => {
        return item.id === id
    });
    if ( index >= 0){
        return users[index];
    }
    else {
        return null;
    }
}
module.exports = searchUser;