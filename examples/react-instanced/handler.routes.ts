import { generateItemsData, generateLinesData } from '../../packages/shared/src';

const routes: Record<string, () => any> = {
  '/lines': () => generateLinesData(),
  '/items': () => generateItemsData(),
}

export default routes;
