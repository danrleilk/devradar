import React, { useEffect, useState } from 'react';
import api from './services/api';
import './App.css';
import './Global.css';
import './Main.css';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';
// Componente: Bloco isolado de Html, CSS e JS, o qual não interfere no restante da aplicação.
// Propriedade: Informações que um componente PAI passa para o componente filho
// Estado: Informações mantidas pelo componente (Lembrar: imutabilidade)

function App() {
  const [devs, setDevs] = useState([]);
  const editModeState = useState({ editMode: false, dev: {} });
  const [{ editMode }] = editModeState;

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');
      setDevs(response.data);
    }
    loadDevs();
  }, [])

  async function handleAddDev(data) {
    const response = await api.post(`/devs`, data);
    if (!devs.includes(response.data)) {
      setDevs([...devs, response.data]);
    }
  }

  async function handleEditDev(dev, data) {
    const { github_username } = dev;

    const response = await api.put(`/devs?github_username=${github_username}`, data);
    if (response.data.modified > 0) {
      const newDevs = await api.get('/devs');
      setDevs(newDevs.data);
    }
  }

  async function handleDeleteDev(github_username) {
    await api.delete(`devs?github_username=${github_username}`);
    setDevs(devs.filter(dev => dev.github_username !== github_username));
  }

  // Estudar api de contexto do React para transmitir dados entre compenentes pai e filho para melhorar mais as mudanças.
  return (
    <div id="app">
      <aside>
        <strong>{editMode ? 'Editar' : 'Cadastrar'}</strong>
        <DevForm onSubmit={handleAddDev} onEdit={handleEditDev} editModeState={editModeState} />
      </aside>

      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev} onDelete={handleDeleteDev} onEdit={editModeState} />
          ))}
        </ul>
      </main>

    </div >
  );
}

export default App;
