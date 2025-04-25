import { Site } from "./site";

export class Company {
  _id?: string;
  code?: string;
  name?: string;
  sites: Site[] = [];
  
}
