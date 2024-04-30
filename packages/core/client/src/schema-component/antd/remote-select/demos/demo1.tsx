/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { APIClientProvider, FormProvider, RemoteSelect, SchemaComponent } from '@nocobase/client';
import React from 'react';
import { mockAPIClient } from '../../../../testUtils';
import { sleep } from '@nocobase/test/web';

const { apiClient, mockRequest } = mockAPIClient();
mockRequest.onGet('/posts:list').reply(async () => {
  await sleep(100);
  return [
    200,
    {
      data: [
        {
          id: 1,
          title: 'title1',
        },
        {
          id: 2,
          title: 'title2',
        },
      ],
    },
  ];
});

// 写一个简单的 schema
const schema = {
  type: 'object',
  properties: {
    association: {
      type: 'array',
      'x-component': 'RemoteSelect',
      'x-component-props': {
        multiple: true,
        fieldNames: {
          label: 'title',
          value: 'id',
        },
        service: {
          resource: 'posts',
          action: 'list',
        },
        style: {
          width: '100%',
        },
      },
    },
  },
};

export default () => {
  return (
    <FormProvider>
      <APIClientProvider apiClient={apiClient}>
        <SchemaComponent components={{ RemoteSelect }} schema={schema} />
      </APIClientProvider>
    </FormProvider>
  );
};
