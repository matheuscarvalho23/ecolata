import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';

import api from '../../services/api';
import './styles.css';
import logo from '../../assets/logo.svg';

/**
 * Atributos de Item;
 *
 * @interface Item
 */
interface Item {
  id: number;
  title: string;
  image_url: string;
}

/**
 * Atributos das UF's na API do IBGE;
 *
 * @interface IBGEUF
 */
interface IBGEUF {
  sigla: string;
}

/**
 * Atributos das cidades na API do IBGE;
 *
 * @interface IBGECities
 */
interface IBGECities {
  nome: string;
}

const Point = () => {
  const [items, setItems]   = useState<Item[]>([]); // Pega os dados de "Item", transformando em um array;
  const [ufs, setUfs]       = useState<string[]>([]); // Pega os dados de "IBGEUF", transformando em um array;
  const [cities, setCities] = useState<string[]>([]); // Pega os dados de "IBGECities", transformando em array;

  const [selectedUf, setSelectedUf] = useState('0'); // Pega os dados da "UF" selecionada e faz a busca das cidades dessa "UF"

  useEffect(() => {
    api
      .get('items')
      .then(response => {
          setItems(response.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get<IBGEUF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla);

        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf==='0') {
      return;
    }
    axios
      .get<IBGECities[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);

        setCities(cityNames);
      });
  }, [selectedUf]);

  /**
   * Função para definir qual UF foi selecionada
   *
   */
  function handleSelectUf(e: ChangeEvent<HTMLSelectElement>) {
    const uf = e.target.value;

    setSelectedUf(uf);
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Home"/>

        <Link to="/">
          <FiArrowLeft/>
          Voltar para home
        </Link>
      </header>

      <form>
        <h1>Cadastro do <br/> ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              id="name"
              name="name"
            /> <br/>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                />
              </div>

              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input
                  type="text"
                  id="whatsapp"
                  name="whatsapp"
                />
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o Endereço no mapa</span>
          </legend>

          <Map center={[ 40.7664898, -73.9813368 ]} zoom={14}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[ 40.7664898, -73.9813368 ]}/>
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select onChange={handleSelectUf} name="uf" id="uf" value={selectedUf}>
                <option value="0"> -- Selecione uma UF</option>
                {ufs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city">
                <option value="0"> -- Selecione uma cidade</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => (
              <li key={item.id}>
                <img src={item.image_url} alt={item.title}/>
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
}

export default Point;