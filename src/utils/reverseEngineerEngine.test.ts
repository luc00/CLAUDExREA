import test from 'node:test';
import assert from 'node:assert/strict';
import {
  detectTargetCategory,
  generateSqlDdl,
  flattenComponentTree,
  assembleProjectZipManifest,
  buildDynamicBlueprint,
  generateClaudePrompt,
  generateClaudeDeepLink,
  CURATED_BLUEPRINTS,
  EntityModel,
  ComponentNode
} from './reverseEngineerEngine';

test('detectTargetCategory classifies keywords correctly', () => {
  assert.equal(detectTargetCategory('https://linear.app'), 'web_app');
  assert.equal(detectTargetCategory('Dyson AM06 Bladeless fan motor'), 'hardware_iot');
  assert.equal(detectTargetCategory('ESP32 sensor telemetry'), 'hardware_iot');
  assert.equal(detectTargetCategory('DeepSeek LLM neural reasoning prompt agent'), 'algorithm_ai');
  assert.equal(detectTargetCategory('Duolingo streak retention growth engine'), 'business_growth');
  assert.equal(detectTargetCategory('Stripe webhook idempotent payment API'), 'api_protocol');
});

test('generateSqlDdl outputs valid PostgreSQL CREATE TABLE statements', () => {
  const sampleEntities: EntityModel[] = [
    {
      tableName: 'devices',
      description: 'Physical sensor node',
      fields: [
        { name: 'id', type: 'UUID', isPrimaryKey: true, description: 'Primary key' },
        { name: 'serial_no', type: 'VARCHAR(64)', isNullable: false, description: 'Serial number' },
        { name: 'is_active', type: 'BOOLEAN', isNullable: false, description: 'Status flag' }
      ]
    },
    {
      tableName: 'readings',
      description: 'Device metric readings',
      fields: [
        { name: 'id', type: 'BIGSERIAL', isPrimaryKey: true, description: 'ID' },
        { name: 'device_id', type: 'UUID', references: '"devices"("id")', description: 'Foreign key' },
        { name: 'temp_c', type: 'FLOAT4', isNullable: false, description: 'Temperature' }
      ]
    }
  ];

  const ddl = generateSqlDdl(sampleEntities);
  assert.ok(ddl.includes('CREATE TABLE IF NOT EXISTS "devices"'));
  assert.ok(ddl.includes('"id" UUID PRIMARY KEY'));
  assert.ok(ddl.includes('CREATE TABLE IF NOT EXISTS "readings"'));
  assert.ok(ddl.includes('REFERENCES "devices"("id")'));
  assert.ok(ddl.includes('CREATE INDEX IF NOT EXISTS "idx_readings_device_id"'));
});

test('flattenComponentTree counts components and state variables accurately', () => {
  const tree: ComponentNode = {
    name: 'RootShell',
    type: 'page',
    description: 'Main shell',
    stateVariables: ['user', 'theme'],
    children: [
      {
        name: 'NavBar',
        type: 'molecule',
        description: 'Header',
        stateVariables: ['isMenuOpen']
      },
      {
        name: 'Canvas',
        type: 'organism',
        description: 'Drawing space',
        stateVariables: ['zoom', 'pan', 'selectedNode'],
        children: [
          {
            name: 'NodeCard',
            type: 'atom',
            description: 'Item card'
          }
        ]
      }
    ]
  };

  const flattened = flattenComponentTree(tree);
  assert.equal(flattened.length, 4);
  assert.equal(flattened[0].name, 'RootShell');
  assert.equal(flattened[0].stateCount, 2);
  assert.equal(flattened[2].name, 'Canvas');
  assert.equal(flattened[2].stateCount, 3);
  assert.equal(flattened[3].name, 'NodeCard');
  assert.equal(flattened[3].stateCount, 0);
});

test('assembleProjectZipManifest generates all required project deliverables', () => {
  const linearBlueprint = CURATED_BLUEPRINTS[0];
  const manifest = assembleProjectZipManifest(linearBlueprint);

  assert.ok(manifest['README.md']);
  assert.ok(manifest['schema.sql']);
  assert.ok(manifest['src/App.tsx']);
  assert.ok(manifest['server/routes.ts']);
  assert.ok(manifest['rea-spec.json']);

  assert.ok(manifest['README.md'].includes('Linear'));
  assert.ok(manifest['schema.sql'].includes('CREATE TABLE'));
});

test('buildDynamicBlueprint returns structured blueprint for arbitrary input', () => {
  const target = 'https://my-custom-startup.io/analytics';
  const blueprint = buildDynamicBlueprint(target);

  assert.ok(blueprint.id.startsWith('custom-'));
  assert.ok(blueprint.architecture.layers.length >= 3);
  assert.ok(blueprint.database.entities.length >= 2);
  assert.ok(blueprint.api.endpoints.length >= 2);
  assert.ok(blueprint.rebuildDeliverables.frontendCode.length > 50);
});

test('generateClaudePrompt produces structured XML directives for Claude cloning', () => {
  const linearBlueprint = CURATED_BLUEPRINTS[0];
  const prompt = generateClaudePrompt(linearBlueprint, { fidelity: 'pixel_perfect' });

  assert.ok(prompt.includes('You are Claude'));
  assert.ok(prompt.includes('<clone_context>'));
  assert.ok(prompt.includes('<design_system_tokens>'));
  assert.ok(prompt.includes('<component_architecture>'));
  assert.ok(prompt.includes('<instructions_for_claude>'));
  assert.ok(prompt.includes('Claude Artifact'));
  assert.ok(prompt.includes('Pixel-Perfect'));
});

test('generateClaudeDeepLink produces valid URL to Claude web chat', () => {
  const prompt = 'Test clone website prompt';
  const deepLink = generateClaudeDeepLink(prompt);

  assert.ok(deepLink.startsWith('https://claude.ai/new?q='));
  assert.ok(deepLink.includes('Test%20clone%20website%20prompt'));
});

