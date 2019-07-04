// import { groupByArray } from '@tomino/toolbelt/group-by-array';
// import { FormElement } from './form_definition';
// import { DataSet } from './form_store';

// export interface IFieldOwner {
//   elements?: FormElement[];
// }

// export class FormPreviewHtml {
//   lastRow = -1;
//   _lastColumn = -1;

//   get lastColumn() {
//     return this._lastColumn;
//   }

//   set lastColumn(value) {
//     // console.trace();
//     // console.log('Setting: ' + value);
//     this._lastColumn = value;
//   }

//   renderControl(control: FormElement, dataSet: DataSet): string {
//     const formElement = control as FormElement;
//     const value = dataSet.getValue(formElement.source);

//     // console.log(dataSet);
//     // console.log(`${formElement.source} ${value}`);

//     switch (formElement.control) {
//       case 'Formula':
//       case 'Input':
//       case 'Text':
//         return value;
//       case 'Select': {
//         let { source, controlProps, list, filterSource, filterColumn } = formElement;
//         const options = filterSource
//           ? dataSet
//               .getSchema(list)
//               .$enum.filter((v: any) => v[filterColumn] === dataSet.getValue(filterSource))
//           : dataSet.getSchema(list).$enum; /*?*/

//         const text = options.find(o => o.value === value).text;
//         return text;
//       }
//       case 'Checkbox':
//         return `<input type="checkbox" ${dataSet.getValue(formElement.source) &&
//           'checked="true"'} />`;
//       case 'Radio':
//         let radioList = formElement.list;
//         const radioOptions = dataSet.getSchema(radioList).$enum;
//         const radioText = radioOptions.find(o => o.value === value).text;
//         return radioText;
//       case 'Repeater':
//         const repeaterList: DataSet[] = dataSet.getValue(formElement.source);
//         return repeaterList.map(l => this.render(formElement, l)).join('\n');
//       case 'Table':
//         const tableList: DataSet[] = dataSet.getValue(formElement.source);
//         return `<table>
//           <thead>
//             <tr>
//               ${formElement.elements.map(e => `<th>${e.label}</th>`).join('\n')}
//             </tr>
//           </thead>
//           <tbody>
//             ${tableList
//               .map(
//                 v => `<tr>
//               ${formElement.elements.map(e => `<td>${v.getValue(e.source)}</td>`).join('\n')}
//             </tr>`
//               )
//               .join('\n')}
//           </tbody>
//           </table>`;
//       case 'Form':
//         return this.render(formElement, dataSet.getValue(control.source));
//       case 'Signature':
//         return '';
//     }

//     throw new Error('Not implemented: ' + formElement.control);
//   }

//   renderColumn(control: FormElement, owner: DataSet) {
//     // console.log(`${control.label} [${control.row} vs ${this.lastRow}] [${control.column}] vs [${this.lastColumn}] `);

//     if (control.row !== this.lastRow) {
//       this.lastRow = control.row;
//       this.lastColumn = 0;
//     }
//     // we initialise all columns and add missing ones in between
//     let columns = [];
//     const formControl = control;

//     // insert missing start column
//     if (control.column > this.lastColumn) {
//       columns.push(`<td colspan="${control.column - this.lastColumn}" />`);
//     }

//     let label = '';
//     if (formControl.control !== 'Signature' && formControl.label) {
//       label = `<b>${formControl.label}</b>` + (formControl.inline ? ': ' : '<br />');
//     }

//     columns.push(
//       `<td colspan="${control.width}">${
//         formControl.elements && formControl.elements.length
//           ? `<fieldset>
//           ${formControl.label && `<legend>${formControl.label}</legend>`}
//           ${this.renderControl(control, owner)}
//         </fieldset>`
//           : `${label}${this.renderControl(control, owner)}`
//       }</td>`
//     );

//     this.lastColumn = control.column + control.width;
//     this.lastRow = control.row;
//     // console.log(`${control.label} New last: ` + this.lastColumn);

//     return columns;
//   }

//   render(formControl: FormElement, owner: DataSet) {
//     this.lastColumn = 0;
//     this.lastRow = 0;

//     const rows = groupByArray(formControl.elements, 'row');
//     return `<table>
//         <tbody>
//           <tr style="display: none"><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /><td /></tr>
//           ${rows
//             .map(row => {
//               const rendered = []
//                 .concat(...row.values.map(element => this.renderColumn(element, owner)))
//                 .join('\n');
//               return `<tr>
//               ${rendered}
//             </tr>`;
//             })
//             .join('\n')}
//         </tbody>
//       </table>`;
//   }
// }

import { FormElement, FormComponentCatalogue, FormComponent } from './form_definition';
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

export class FormPreviewHtml {
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
  // render(formControl: FormElement, owner: DataSet, catalogue: FormComponentCatalogue) {
  //   return formControl.elements
  //     .map(
  //       row =>
  //         (catalogue.components[row.control] as FormComponent).toHtml &&
  //         (catalogue.components[row.control] as FormComponent).toHtml(owner, { formElement: row}, null, catalogue)
  //     )
  //     .join('\n');
  // }
}
