import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {

  /**
   * Função para listar vários pontos de coleta a partir de filtros
   *
   * @param {Request} request
   * @param {Response} response
   * @memberof PointsController
   */
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query; // Var para pegar os parâmetros da requisição e usar como filtro;

    // Var que transforma o parâmetro "items" em um array numérico e tira os espaços depois da ",";
    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    // Var para selecionar os pontos de coletas com determinados filtros;
    const points = await knex('points')
      .select('points.*')
      .leftJoin('points_items', 'points.id', '=', 'points_items.point_id')
      .whereIn('item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct();

    if (!points) {
      return response.status(400).json({
        status: 'error',
        message: 'Points not found with filters.'
      });
    } else {
      return response.json({
        status: 'success',
        list: points
      });
    }
  }

  /**
   * Função para listar um ponto de coleta específico
   *
   * @param {Request} request
   * @param {Response} response
   * @memberof PointsController
   */
  async show(request: Request, response: Response) {
    const { id } = request.params; // Variável para pegar o ID passado na requisição.

    // Var para buscar resultados a partir do ID da requisição.
    const point = await knex('points')
      .where('id', id)
      .first();

    // Var para buscar items existentes em um ponto de coleta a partir do ID da requisição.
    const items = await knex('items')
      .select('items.title AS title')
      .leftJoin('points_items', 'items.id', '=', 'points_items.item_id')
      .where('point_id', id);

    // Verificação para saber se existe resultado com a busca do ID.
    if (!point) {
      // Caso não haja resultado, retorno para avisar que não foi encontrado registros com o ID da requisição.
      return response.status(400).json({
        status: 'error',
        message: 'Point not found.'
      });
    } else {
      // Caso haja resultado, é mostrado uma mensagem de sucesso junto com o resultado a partir do ID da requisição.
      return response.json({
        status: 'success',
        list: {
          points: point,
          items: (items.length===0) ? 'No items relacioned' : items
        }
      });
    }
  }

  /**
   * Função para a criação de pontos de coletas
   *
   * @param {Request} request
   * @param {Response} response
   * @returns
   * @memberof PointsController
   */
  async store(request: Request, response: Response) {
    // Variável para pegar os parãmetros da requisição
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    // Variável para definir os valores a serem inseridos na tabela "points"
    const point = {
      image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const trx = await knex.transaction();

    const idItems = await trx("points").insert(point); // Variável para retornar o ID insirido no último registro da tabela "points"

    const point_id = idItems[0]; // Variável para definir o ID de um "point" a partir do primeiro index da variável "idItems"

    const pointItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id,
      };
    });

    await trx("points_items").insert(pointItems);

    await trx.commit();

    return response.json({
      id: point_id,
      ...point,
    });
  }
}

export default PointsController;
