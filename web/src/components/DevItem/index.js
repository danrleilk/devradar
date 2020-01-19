import React from 'react';

import './styles.css';

function DevItem({ dev, onDelete, onEdit }) {
    const [{ editMode, dev: editingDev }, setEditMode] = onEdit;

    function editDev() {
        setEditMode({
            editMode: (editingDev._id !== dev._id) ? true : !editMode,
            dev
        });
    };

    function deleteDev() {
        onDelete(dev.github_username);
    };

    return (
        <li className="dev-item">
            <header>
                <img src={dev.avatar_url} alt={dev.name} />
                <div className="user-info">
                    <strong>{dev.name}</strong>
                    <span>{dev.techs.join(', ')}</span>
                </div>
            </header>
            <p>{dev.bio}</p>

            <div className="actions">
                <button><a href={`https://github.com/${dev.github_username}`}>Acessar Perfil no Github</a></button>
                <button onClick={editDev}>Editar</button>
                <button onClick={deleteDev}>Excluir</button>
            </div>
        </li >
    )
}

export default DevItem;