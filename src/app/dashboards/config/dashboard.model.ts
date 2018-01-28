export class Dashboard {
  id: number;
  name: string;
  pages: number[];
  ordinal: number;
  
  constructor(params) {
    this.id = params.id;
    this.name = params.name;
    this.pages = params.pageIds || [];
    this.ordinal = params.ordinal;
  }
  
  get pagesCount() {
    return this.pages.length;
  }
}