import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';

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

  const [selectedUf, setSelectedUf]             = useState('0'); // Pega os dados da "UF" selecionada e faz a busca das cidades dessa "UF";
  const [selectedCity, setSelectedCity]         = useState('0'); // Pega os dados da "City" selecionada e atribui para usar no cadastro;
  const [inicialPosition, setInicialPosition]   = useState<[number,number]>([0,0]); // Pega a Latitude & Longitude atual a partir da localização do usuário;
  const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0]); // Pega a Latitude & Longitude ao clicar em uma posição no mapa;
  const [selectedItems, setSelectedItems]       = useState<number[]>([]); // Pega os items selecionados;

  // Pega os dados do inseridos no formulário;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      setInicialPosition([latitude, longitude]);
    });
  }, []);

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
   * Função para definir qual UF foi selecionada;
   *
   * @param {ChangeEvent<HTMLSelectElement>} e
   */
  function handleSelectUf(e: ChangeEvent<HTMLSelectElement>) {
    const uf = e.target.value;

    setSelectedUf(uf);
  }

  /**
   * Função para definir qual Cidade foi selecionada
   *
   * @param {ChangeEvent<HTMLSelectElement>} e
   */
  function handleSelectCity(e: ChangeEvent<HTMLSelectElement>) {
    const city = e.target.value;

    setSelectedCity(city);
  }

  /**
   * Função para selecionar a localização no mapa
   *
   * @param {LeafletMouseEvent} e
   */
  function handleMap(e: LeafletMouseEvent) {
    setSelectedPosition([
      e.latlng.lat,
      e.latlng.lng,
    ]);
  }

  /**
   * Função para pegar os dados inseridos nos inputs;
   *
   * @param {ChangeEvent<HTMLInputElement>} e
   */
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  /**
   * Função para receber o ID do item de coleta e posteriormente enviá-lo para o cadastro
   *
   * @param {number} id
   */
  function handleSelectItem(id: number) {
    const itemSelected = selectedItems.findIndex(item => item===id);

    if (itemSelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([ ...selectedItems, id ]);
    }
  }

  /**
   * Função para cadastrar ponto de coleta;
   *
   * @param {FormEvent} e
   */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const { name, email, whatsapp } = formData;
    const [latitude, longitude]     = selectedPosition;
    const uf    = selectedUf;
    const city  = selectedCity;
    const items = selectedItems;

    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items
    };

    await api
      .post('points', data);

    alert('criado!')
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

      <form onSubmit={handleSubmit}>
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
              onChange={handleInputChange}
            /> <br/>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={handleInputChange}
                />
              </div>

              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input
                  type="text"
                  id="whatsapp"
                  name="whatsapp"
                  onChange={handleInputChange}
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

          <Map center={inicialPosition} zoom={15} onClick={handleMap}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition}/>
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
              <select onChange={handleSelectCity} name="city" id="city" value={selectedCity}>
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
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : '' }
              >
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