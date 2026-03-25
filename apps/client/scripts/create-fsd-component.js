#!/usr/bin/env node
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Скрипт генерации React-компонента
 *
 * Использование:
 * npm run cc Button shared/ui
 *
 * Где:
 *  - Button — имя компонента
 *  - shared/ui — путь внутри src (необязательно)
 */

const fs = require('fs');
const path = require('path');

/**
 * Делает первую букву строки заглавной
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const rawName = process.argv[2];
const targetPath = process.argv[3] || '';

if (!rawName) {
  console.error('Укажи имя компонента');
  process.exit(1);
}

const name = capitalize(rawName);

const baseDir = path.resolve(process.cwd(), `src/${targetPath}/${name}`);

const uiDir = path.join(baseDir, 'ui');

fs.mkdirSync(uiDir, { recursive: true });

// main index.ts
fs.writeFileSync(path.join(baseDir, 'index.ts'), `export { ${name} } from "./ui";\n`);

// component.tsx
fs.writeFileSync(
  path.join(uiDir, `${name}.tsx`),
  `import type { T${name}Props } from './types';
import styles from "./${name}.module.scss";

/**
 * ${name} компонент
 */
export const ${name} = ({}: T${name}Props) => {
  return (
    <div className={styles.container}>${name}</div>
  );
};
`
);

// types.ts
fs.writeFileSync(
  path.join(uiDir, `types.ts`),
  `export type T${name}Props = {};
`
);

// styles
fs.writeFileSync(
  path.join(uiDir, `${name}.module.scss`),
  `.container {}
`
);

// ui index.ts
fs.writeFileSync(path.join(uiDir, 'index.ts'), `export { ${name} } from "./${name}";\n`);

console.info(`✅ Компонент ${name} создан в ${baseDir}`);
