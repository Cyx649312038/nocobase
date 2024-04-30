/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { SQLModel } from '../../sql-collection/sql-model';
import { Sequelize } from 'sequelize';

describe('select query', () => {
  const model = class extends SQLModel {};
  model.init(null, {
    modelName: 'users',
    tableName: 'users',
    sequelize: new Sequelize({
      dialect: 'postgres',
    }),
  });
  model.sql = 'SELECT * FROM "users"';
  model.collection = {
    fields: new Map(
      Object.entries({
        id: {},
        name: {},
      }),
    ),
  } as any;
  const queryGenerator = model.queryInterface.queryGenerator as any;

  test('plain sql', () => {
    const query = queryGenerator.selectQuery('users', {}, model);
    expect(query).toBe('SELECT * FROM "users";');
  });

  test('attributes', () => {
    const query = queryGenerator.selectQuery('users', { attributes: ['id', 'name'] }, model);
    expect(query).toBe('SELECT "id", "name" FROM (SELECT * FROM "users") AS "users";');
  });

  test('where', () => {
    const query = queryGenerator.selectQuery('users', { where: { id: 1 } }, model);
    expect(query).toBe('SELECT * FROM (SELECT * FROM "users") AS "users" WHERE "users"."id" = 1;');
  });

  test('group', () => {
    const query1 = queryGenerator.selectQuery('users', { group: 'id' }, model);
    expect(query1).toBe('SELECT * FROM (SELECT * FROM "users") AS "users" GROUP BY "id";');
    const query2 = queryGenerator.selectQuery('users', { group: ['id', 'name'] }, model);
    expect(query2).toBe('SELECT * FROM (SELECT * FROM "users") AS "users" GROUP BY "id", "name";');
  });

  test('order', () => {
    const query = queryGenerator.selectQuery('users', { order: ['id'] }, model);
    expect(query).toBe('SELECT * FROM (SELECT * FROM "users") AS "users" ORDER BY "users"."id";');
  });

  test('limit, offset', () => {
    const query = queryGenerator.selectQuery('users', { limit: 1, offset: 0 }, model);
    expect(query).toBe('SELECT * FROM (SELECT * FROM "users") AS "users" LIMIT 1 OFFSET 0;');
  });

  test('complex sql', () => {
    const query = queryGenerator.selectQuery(
      'users',
      {
        attributes: ['id', 'name'],
        where: { id: 1 },
        group: 'id',
        order: ['id'],
        limit: 1,
        offset: 0,
      },
      model,
    );
    expect(query).toBe(
      'SELECT "id", "name" FROM (SELECT * FROM "users") AS "users" WHERE "users"."id" = 1 GROUP BY "id" ORDER BY "users"."id" LIMIT 1 OFFSET 0;',
    );
  });
});
