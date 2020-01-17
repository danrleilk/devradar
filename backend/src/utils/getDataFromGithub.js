const axios = require('axios');

async function getGithubData(github_username) {
    const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    // let { name = login, avatar_url, bio } = apiResponse.data;
    // Desconstrução atribuindo valor padrão não funciona devido a retorno null pela api do github.
    let { name, login, avatar_url, bio } = apiResponse.data;

    if (!name) { name = login; }

    return { name, avatar_url, bio };
}

module.exports = getGithubData;