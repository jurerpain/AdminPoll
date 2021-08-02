class User {

    constructor() {
        this.url = 'http://127.0.0.1:3001/user'
    }

    async createUser (name, status, balance, uuid) {
        const response = await fetch(this.url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                status,
                uuid,
                balance,
            })
        });
        // console.log(await response.json())
        return await response.json();

    }
}

export default User;