import express from "express";
import knex from '../database/connection';

module.exports = {
  async getItems(res) {
    

    return res.json(serializedItems)
  }
}
