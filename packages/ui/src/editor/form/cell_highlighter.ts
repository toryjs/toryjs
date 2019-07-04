import { observable, action } from 'mobx';

export class CellHighlighter {
  grid: string[][];

  lastHightLight: number[][] = [];

  constructor(rows: number = 1, columns: number = 1) {
    this.grid = [];
    this.lastHightLight = [];

    for (let i = 1; i <= rows; i++) {
      let row: any = {};
      for (let j = 1; j <= columns; j++) {
        row[j] = '';
      }
      this.grid[i] = observable(row);
    }
  }

  clearHighlight() {
    for (let cell of this.lastHightLight) {
      this.grid[cell[0]][cell[1]] = '';
    }
    this.lastHightLight = [];
  }

  highlight(row: number = 1, column: number = 1, className: string = '', width: number = 1) {
    if ((row as any) === '' || (column as any) === '') {
      return;
    }
    for (let i = 0; i < width; i++) {
      this.grid[row][column + i] = className;
      // console.log(`S ${row} ${column} ${className}`);
      this.lastHightLight.push([row, column + i]);
    }

    // console.log(`H ${row} ${column} ${className}`);
    // console.log(toJS(this.grid[1]));
  }

  highlightMultiple = action((cells: { row: number; column: number; className: string }[]) => {
    for (let cell of cells) {
      this.grid[cell.row][cell.column] = cell.className;
      // console.log(`S ${cell.row} ${cell.column} ${cell.className}`);
      this.lastHightLight.push([cell.row, cell.column]);
    }

    // console.log(`H ${row} ${column} ${className}`);
    // console.log(toJS(this.grid[1]));
  });

  find(row = 1, column = 1) {
    return this.grid[row][column];
  }
}
