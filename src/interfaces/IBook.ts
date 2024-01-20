import { IBookStatus } from './IBookStatus';

export interface IBook {
  name: string;
  qtd: number;
  author: string;
  position: string;
  status: IBookStatus;
  code: number;
}
