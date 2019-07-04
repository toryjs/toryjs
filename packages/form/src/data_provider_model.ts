export interface IndexedDataProvider {
  [index: string]: DataProvider;
}

interface ListItem {
  icon: string;
  text: string;
  value: string;
}

export interface ListItemsProvider {
  [index: string]: ListItem[];
}

export class DataProvider {
  public value(_id: string) {
    /**/
  }
}
