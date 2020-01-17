import React, { useEffect, useState } from 'react';
import api from './services/api';
import './App.css';
import './Global.css';
import './Sidebar.css';
import './Main.css';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';
// Componente: Bloco isolado de Html, CSS e JS, o qual não interfere no restante da aplicação.
// Só podemos fazer um componente por arquivo.
// Propriedade: Informações que um componente PAI passa para o componente filho
// Estado: Informações mantidas pelo componente (Lembrar: imutabilidade)

function App() {
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');
      console.log(response.data)
      setDevs(response.data);
    }
    loadDevs();
  }, [])

  async function handleAddDev(data) {
    const response = await api.post('/devs', data);
    console.log(response);

    setDevs([...devs, response.data]);
  }

  // Estudar api de contexto do React para transmitir dados entre compenentes pai e filho para melhorar mais as mudanças.
  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>

      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev} />
          ))}
        </ul>
      </main>

    </div >
  );
}

export default App;
