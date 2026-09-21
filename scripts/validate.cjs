const SwaggerParser = require('@apidevtools/swagger-parser');
const assert = require('node:assert/strict');
(async () => {
  const api = await SwaggerParser.validate('openapi.yaml');
  const methods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'];
  const operations = Object.values(api.paths).flatMap(p => methods.filter(m => p[m]).map(m => p[m]));
  assert.equal(operations.length, 12);
  assert.equal(Object.keys(api.components.schemas).length, 6);
  assert(operations.every(op => !op.requestBody), 'Все входные данные должны быть в URL');
  assert.equal(api.components.schemas.Ticket.properties.comment.maxLength, 341);
  assert.notEqual(api.components.schemas.TicketType.nullable, true);
  assert(api.components.schemas.EventType.enum.includes(null));
  for (const name of ['/sell/{ticket-id}/{person-id}/{price}', '/person/{person-id}/cancel']) {
    assert.equal(api.paths[name].servers[0].url, '/booking');
  }
  for (const op of [api.paths['/tickets'].post, api.paths['/tickets/{id}'].put]) {
    assert.equal(op.parameters[0].in, 'query');
    assert(op.parameters[0].content['application/json']);
  }
  for (const item of Object.values(api.paths)) {
    for (const method of ['get', 'head']) {
      if (item[method]) assert(!item[method].responses['400']);
    }
    if (item.delete) assert(!item.delete.responses['404']);
  }
  const resource = api.paths['/tickets/{id}'];
  assert(resource.put && resource.head && api.paths['/tickets'].options);
  assert(resource.get.responses['304'].headers.ETag);
  assert(!resource.get.responses['304'].content);
  assert(Object.values(resource.head.responses).every(response => !response.content));
  for (const schema of [api.components.schemas.Ticket.properties.creationDate,
                        api.components.schemas.ErrorResponse.properties.timestamp]) {
    assert(!schema.format);
    assert(new RegExp(schema.pattern).test(schema.example));
    assert(!new RegExp(schema.pattern).test('21.09.2026 25:61:00'));
  }
  console.log('Проверены статусы GET/DELETE, HEAD/OPTIONS, 304 без тела и формат времени.');
  console.log('OpenAPI 3.0.3: валидна; 12 операций, 6 схем; ограничения и URL-параметры проверены.');
})().catch(error => { console.error(error); process.exitCode = 1; });
