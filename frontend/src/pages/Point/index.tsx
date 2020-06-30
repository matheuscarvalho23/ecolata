import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';

import './styles.css';
import logo from '../../assets/logo.svg';

const Point = () => {
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
              <select name="uf" id="uf">
                <option value="0">Selecione uma UF</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city">
                <option value="0">Selecione uma cidade</option>
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
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="Teste"/>
              <span>Óleo de cozinha</span>
            </li>
            <li className="selected">
              <img src="http://localhost:3333/uploads/baterias.svg" alt="Teste"/>
              <span>Óleo de cozinha</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/lampadas.svg" alt="Teste"/>
              <span>Óleo de cozinha</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/papeis-papelao.svg" alt="Teste"/>
              <span>Óleo de cozinha</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/organicos.svg" alt="Teste"/>
              <span>Óleo de cozinha</span>
            </li>
            <li className="selected">
              <img src="http://localhost:3333/uploads/eletronicos.svg" alt="Teste"/>
              <span>Óleo de cozinha</span>
            </li>
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
}

export default Point;