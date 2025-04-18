import { Group } from './group';
import {Company} from "./company";

export class User {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  companyId: Company;
  name?: string;
  site: string;
  avatar?: string;
  email?: string;
  phone?: string;
  password?: string;
  groupsId?: Group;
  companyName?: string;
  createdAt?: Date;
  updatedAt?: Date;

}

export class ResToken {
  token?: string;
}
