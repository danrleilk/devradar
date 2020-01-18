const Dev = require('./../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray');
const getDataFromGithub = require('../utils/getDataFromGithub');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();
        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiResponse = await getDataFromGithub(github_username);

            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

            dev = await Dev.create({
                github_username,
                name: apiResponse.name,
                avatar_url: apiResponse.avatar_url,
                bio: apiResponse.bio,
                techs: techsArray,
                location,
            });
            // filtrar as conexões que estão até 10 km e ao menos 1 tech igual.
            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        } else {
            return response.json("Usuário já cadastrado.")
        }
        return response.json(dev);
    },

    async destroy(request, response) {
        const { github_username } = request.body;

        try {
            await Dev.findOneAndDelete({ github_username })
                .then(deletedDev => {
                    if (deletedDev) {
                        return response.json(`Dev removido tinha a forma: ${deletedDev}`)
                    } else {
                        return response.json(`Nenhum Dev encontrado com esses parametros.`)
                    }
                });
        } catch (e) {
            console.error(e);
        }
    },

    async update(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (dev) {
            const apiData = await getDataFromGithub(github_username);

            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

            try {
                await Dev.updateOne(
                    { github_username: github_username },
                    {
                        $set: {
                            name: apiData.name,
                            avatar_url: apiData.avatar_url,
                            bio: apiData.bio,
                            techs: techsArray,
                            location: location,
                        }
                    }
                );
            } catch (e) {
                console.log(e);
            }
            dev = await Dev.findOne({ github_username });
            return response.json(dev);
        } else {
            return response.json('Dev não encontrado.');
        }
    },

};