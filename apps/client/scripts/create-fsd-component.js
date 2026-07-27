#!/usr/bin/env node
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Скрипт генерации React-компонента
 *
 * Использование:
 * npm run cc Button shared/ui
 *
 * Где:
 *  - Button — имя компонента
 *  - shared/ui — путь внутри src (необязательно)
 *
 * Для shared/ui генерирует UI-kit слайс: ui/ + model/ + stories/ + tests/
 * и добавляет экспорт в `src/shared/ui/index.ts`.
 * Для остальных путей — ui/<Name> с types рядом (feature/widget паттерн).
 */

const fs = require('fs');
const path = require('path');

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Добавляет `export { X }` в root barrel shared/ui (типы — только через `@/shared/ui/<Name>`). */
function appendToUiKitBarrel(name) {
  const barrelPath = path.resolve(process.cwd(), 'src/shared/ui/index.ts');
  if (!fs.existsSync(barrelPath)) {
    console.warn(`⚠️  Не найден ${barrelPath} — root barrel не обновлён`);
    return;
  }

  let content = fs.readFileSync(barrelPath, 'utf8');
  const componentExport = `export { ${name} } from './${name}';`;

  if (content.includes(componentExport)) {
    console.info(`ℹ️  ${name} уже есть в shared/ui/index.ts`);
    return;
  }

  if (!content.endsWith('\n')) content += '\n';
  content += `${componentExport}\n`;
  fs.writeFileSync(barrelPath, content);
  console.info(`✅ Добавлен экспорт в shared/ui/index.ts`);
}

const rawName = process.argv[2];
const targetPath = process.argv[3] || '';

if (!rawName) {
  console.error('Укажи имя компонента');
  process.exit(1);
}

const name = capitalize(rawName);
const isUiKit = targetPath.replace(/\\/g, '/') === 'shared/ui';
const baseDir = path.resolve(process.cwd(), `src/${targetPath}/${name}`);

if (fs.existsSync(baseDir)) {
  console.error(`❌ Уже существует: ${baseDir}`);
  process.exit(1);
}

if (isUiKit) {
  const uiDir = path.join(baseDir, 'ui');
  const modelDir = path.join(baseDir, 'model');
  const storiesDir = path.join(baseDir, 'stories');
  const testsDir = path.join(baseDir, 'tests');

  fs.mkdirSync(uiDir, { recursive: true });
  fs.mkdirSync(modelDir, { recursive: true });
  fs.mkdirSync(storiesDir, { recursive: true });
  fs.mkdirSync(testsDir, { recursive: true });

  fs.writeFileSync(
    path.join(baseDir, 'index.ts'),
    `export { ${name} } from './ui';\nexport type { T${name}Props } from './model';\n`
  );

  fs.writeFileSync(
    path.join(modelDir, 'types.ts'),
    `export type T${name}Props = {\n  className?: string;\n};\n`
  );

  fs.writeFileSync(
    path.join(modelDir, 'index.ts'),
    `export type { T${name}Props } from './types';\n`
  );

  fs.writeFileSync(
    path.join(uiDir, `${name}.tsx`),
    `import type { T${name}Props } from '../model';

import styles from './${name}.module.scss';

export const ${name} = ({ className = '' }: T${name}Props) => {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>${name}</div>;
};
`
  );

  fs.writeFileSync(path.join(uiDir, `${name}.module.scss`), `.root {}\n`);
  fs.writeFileSync(path.join(uiDir, 'index.ts'), `export { ${name} } from './${name}';\n`);

  fs.writeFileSync(
    path.join(storiesDir, `${name}.stories.tsx`),
    `import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ${name} } from '../ui';

const meta = {
  title: 'shared/ui/${name}',
  component: ${name},
} satisfies Meta<typeof ${name}>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};
`
  );

  fs.writeFileSync(
    path.join(testsDir, `${name}.test.tsx`),
    `import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ${name} } from '../ui';

describe('${name}', () => {
  it('forwards className to root', () => {
    const { container } = render(<${name} className="kit-${name}" />);
    expect(container.querySelector('.kit-${name}')).toBeInTheDocument();
  });
});
`
  );

  appendToUiKitBarrel(name);
  console.info(`✅ UI-kit слайс ${name} создан в ${baseDir}`);
  process.exit(0);
}

const uiDir = path.join(baseDir, 'ui');

fs.mkdirSync(uiDir, { recursive: true });

fs.writeFileSync(path.join(baseDir, 'index.ts'), `export { ${name} } from './ui';\n`);

fs.writeFileSync(
  path.join(uiDir, `${name}.tsx`),
  `import type { T${name}Props } from './types';

import styles from './${name}.module.scss';

export const ${name} = ({ className }: T${name}Props) => {
  return <div className={[styles.container, className].filter(Boolean).join(' ')}>${name}</div>;
};
`
);

fs.writeFileSync(
  path.join(uiDir, 'types.ts'),
  `export type T${name}Props = {\n  className?: string;\n};\n`
);

fs.writeFileSync(path.join(uiDir, `${name}.module.scss`), `.container {}\n`);

fs.writeFileSync(path.join(uiDir, 'index.ts'), `export { ${name} } from './${name}';\n`);

console.info(`✅ Компонент ${name} создан в ${baseDir}`);
