import { FormElement, FormComponentCatalogue } from './form_definition';
import { DataSet } from './form_store';

export interface IFieldOwner {
  elements?: FormElement[];
}

interface Props {
  owner: DataSet;
  formControl: IFieldOwner;
  handlers?: { [index: string]: () => void };
  child?: boolean;
}

export class FormPreviewText {
  // lastRow = -1;
  // lastColumn = -1;

  //   renderColumn(control: FormElement, owner: DataSet, catalogue: FormComponentCatalogue) {
  //     if (control.row !== this.lastRow) {
  //       this.lastRow = control.row;
  //       this.lastColumn = 0;
  //     }
  //     // we initialise all columns and add missing ones in between
  //     let columns = [];
  //     const formControl = control;

  //     let label =
  //       formControl.control === 'Text'
  //         ? `\n${formControl.label}`
  //         : !formControl.label
  //           ? ''
  //           : formControl.elements && formControl.elements.length
  //             ? `: ${formControl.label.trim()}`
  //             : `${formControl.label.trim()}: `;

  //     if (formControl.elements && formControl.elements.length) {
  //       columns.push(`\n== Start${label} ==
  // ${catalogue.components[control.control].toString(control, owner, catalogue)}
  // == End${label} ==`);
  //     } else {
  //       columns.push(
  //         `${label}${catalogue.components[control.control].toString(control, owner, catalogue)}`
  //       );
  //     }

  //     this.lastColumn = control.column + control.width;
  //     return columns;
  //   }

  render(formControl: FormElement, owner: DataSet, catalogue: FormComponentCatalogue) {
    // this.lastColumn = 0;
    // this.lastRow = 0;

    // return formControl.elements
    //   .map(row => catalogue.components[row.control].toString(row, owner, catalogue))
    //   .join('\n');
    return '';
  }
}
