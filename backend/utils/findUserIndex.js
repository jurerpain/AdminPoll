function searchUserIndex ( id, users ) {
    return users.findIndex((item) =>
        item.id === id
    );
}
module.exports = searchUserIndex;