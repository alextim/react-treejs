import { generateItemsData, generateLinesData } from '../src/shared';
import type { MockHandler } from '../vite-plugin-mock-server';

const mockHandlers: MockHandler[] = [
    {
    pattern: '/api/items',
    handle: (req, res) => {
      const data = generateItemsData();
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    }
  },
  {
    pattern: '/api/lines',
    handle: (req, res) => {
      const data = generateLinesData();
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    }
  },
];

export default mockHandlers;
