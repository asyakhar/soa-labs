const SwaggerParser = require('@apidevtools/swagger-parser');
const assert = require('node:assert/strict');
(async () => {
  const api = await SwaggerParser.validate('openapi.yaml');
  const methods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'];
  const operations = Object.values(api.paths).flatMap(p => methods.filter(m => p[m]).map(m => p[m]));
  assert.equal(operations.length, 10);
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
  console.log('OpenAPI 3.0.3: валидна; 10 операций, 6 схем; ограничения и URL-параметры проверены.');
})().catch(error => { console.error(error); process.exitCode = 1; });
