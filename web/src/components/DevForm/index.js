import React, { useState, useEffect } from 'react';
import './styles.css';

function DevForm({ onSubmit, onEdit, editModeState }) {

    const [{ editMode, dev }, setEditMode] = editModeState;
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [github_username, setGithubUsername] = useState('');
    const [techs, setTechs] = useState('');

    useEffect(() => {
        if (!editMode) {
            setGithubUsername('');
            setTechs('');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    setLatitude(latitude);
                    setLongitude(longitude);
                },
                (err) => {
                    console.log(err);
                }, {
                timeout: 30000,
            }
            )
        } else {
            const { github_username, techs, location: { coordinates: [latitude, longitude] } } = dev;
            setGithubUsername(github_username);
            setTechs(techs.join(', '));
            setLatitude(latitude);
            setLongitude(longitude);
        }
    }, [editMode, dev]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (editMode) {
            await onEdit(dev, {
                github_username,
                techs,
                latitude,
                longitude
            })
            setEditMode({ editMode: false, dev: {} });
        } else {
            await onSubmit({
                github_username,
                techs,
                latitude,
                longitude,
            });
        }
        setGithubUsername('');
        setTechs('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-block">
                <label htmlFor="github_username">Usuário do Github</label>
                <input name="github_username" id="github_username"
                    value={github_username}
                    disabled={editMode}
                    onChange={e => setGithubUsername(e.target.value)}
                    required />
            </div>

            <div className="input-block">
                <label htmlFor="techs">Tecnologias</label>
                <input name="techs" id="techs"
                    value={techs}
                    onChange={e => setTechs(e.target.value)}
                    required />
            </div>

            <div className="input-group">
                <div className="input-block">
                    <label htmlFor="latitude">Latitude</label>
                    <input
                        name="latitude" id="latitude"
                        type="number"
                        value={latitude}
                        onChange={e => setLatitude(e.target.value)}
                        required />
                </div>
                <div className="input-block">
                    <label htmlFor="longitude">Longitude</label>
                    <input
                        name="longitude" id="longitude"
                        type="number"
                        value={longitude}
                        onChange={e => setLongitude(e.target.value)}
                        required />
                </div>
            </div>

            <button type="submit">Salvar</button>
        </form>
    )
}



export default DevForm;