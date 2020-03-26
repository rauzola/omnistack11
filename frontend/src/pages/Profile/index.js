import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';
import { FiPower, FiTrash2 } from 'react-icons/fi';
import logoImg from '../../assets/logo.svg';
import './styles.scss';

export default function Profile() {
  const history = useHistory();
  const ongId = localStorage.getItem('ongId');
  const ongName = localStorage.getItem('ongName');
  const [incidents, setIncidents] = useState([]);

  console.log(ongId, ongName)

  useEffect(() => {
    api.get('profile', {
      headers: {
        Authorization: ongId,
      }
    })
      .then(response => {
        console.log(response)
        setIncidents(response.data)
      })
      .catch(console.error)
  }, [ongId]);

  async function handleDeleteIncident(id){
    try {
      await api.delete(`incidents/${id}`, {
        headers: { Authorization: ongId }
      })

      setIncidents(incidents.filter(incident => incident.id !== id))
    } catch (error) {
      alert('Error ao deletar caso, tente novamente.');
    }
  }

  function handleLogout() {
    localStorage.clear();

    history.push('/');
  }

  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be The Hero" />
        <span>Bem-vindo {ongName}</span>

        <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
        <button onClick={handleLogout} type="button">
          <FiPower size={18} color="#e02041" />
        </button>
      </header>

      <h1>Casos cadastrados</h1>

      <ul className="list">
        {incidents.map(incident => {
          return (
            <li key={incident.id}>
              <strong>CASO:</strong>
              <p>{incident.title}</p>

              <strong>DESCRIÇÃO: </strong>
              <p>{incident.description}</p>

              <strong>VALOR: </strong>
              <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(incident.value)}</p>

              <button type="button" onClick={()=> handleDeleteIncident(incident.id)}>
                <FiTrash2 size={20}  color="#a8a8b3" />
              </button>
            </li>
          );
        })}
      </ul >
    </div>
  );
}
