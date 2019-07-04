import Ajv from 'ajv';

import { Schema } from './data_schema_model';
import { DataSet } from './form_store';
import { buildStore } from './mst_builder';
import { FormElement, FormComponentCatalogue } from './form_definition';
import { JSONSchema } from './json_schema';
// import { FormPreviewHtml } from './form_preview_html';
import { FormPreviewText } from './form_preview_text';
import { FormPreviewHtml } from './form_preview_html';

export interface IFormElementOwner {
  elements?: FormElement[];
  name?: string;
  description?: string;
}

/* =========================================================
    Form Model
   ======================================================== */

export class FormModel {
  dataSet: DataSet;
  name: string;
  description: string;
  elements: FormElement[];
  pages: FormElement[];
  catalogue: FormComponentCatalogue;
  formDefinition: FormElement;
  control = 'Form';

  constructor(form: FormElement, jsonSchema: JSONSchema, data: any, setUndo = true) {
    let formWithProps = this.addControlProps(form);
    this.name = formWithProps.props.label;
    this.description = formWithProps.documentation;
    this.elements = formWithProps.elements;
    this.formDefinition = formWithProps;
    this.pages = formWithProps.pages;

    // create dataset
    if (jsonSchema) {
      const schema = new Schema(jsonSchema);
      this.dataSet = buildStore(schema, null, setUndo).create(data);

      // // set undo manager
      // if (setUndo) {
      //   setUndoManager(this.dataSet);
      // }
    }
  }

  addArrayProps(parent: FormElement, elements: FormElement[]) {
    let result = [];
    for (let e of elements) {
      let child = this.addControlProps(e);

      if (child) {
        child.parent = parent;
      }
      result.push(child);
    }
    return result;
  }

  addControlProps(element: FormElement) {
    if (!element) {
      return;
    }
    let result = { ...element };
    result.props = { ...element.props };

    if (!result.props.control) {
      result.props.control = element.control;
    }
    if (result.elements) {
      result.elements = this.addArrayProps(result, result.elements);
    }
    if (result.pages) {
      result.pages = this.addArrayProps(result, result.pages);
    }
    return result;
  }

  createHtmlPreview() {
    let formPreview = new FormPreviewHtml();
    // return formPreview.render(this, this.dataSet, this.catalogue);
    return '';
  }

  createTextPreview() {
    let textPreview = new FormPreviewText();
    // return textPreview.render(this, this.dataSet, this.catalogue);
    return '';
  }

  validateWithReport(
    root: IFormElementOwner = this,
    owner = this.dataSet
  ): boolean | Ajv.ErrorObject[] {
    return owner.validateDataset();
  }

  // validateWithReport(root: IFormElementOwner = this, owner = this.dataSet): ValidationResult {
  //   let total = 0;
  //   let valid = 0;
  //   let required = 0;
  //   let requiredValid = 0;

  //   // validate self

  //   for (let element of root.elements) {
  //     if (element.control === 'Form') {
  //       // form can change owner
  //       let result = this.validateWithReport(
  //         element,
  //         element.source ? owner.getValue(element.source) : owner
  //       );
  //       total += result.total;
  //       valid += result.valid;
  //       required += result.required;
  //       requiredValid += result.requiredValid;

  //       continue;
  //     } else if (element.control === 'Table' || element.control === 'Repeater') {
  //       // validate individual elements
  //       let array: any[] = owner.getValue(element.source);

  //       // browse array and validate each element
  //       for (let item of array) {
  //         let result = this.validateWithReport(element, item);
  //         total += result.total;
  //         valid += result.valid;
  //         required += result.required;
  //         requiredValid += result.requiredValid;
  //       }
  //     }

  //     let schema = owner.getSchema(element.source);
  //     let isRequired = schema.required || schema.minItems > 0;

  //     // if the element is not required and it does not have any value
  //     // we exclude it from the validation

  //     if (!element.source || (!isRequired && !owner.getValue(element.source))) {
  //       continue;
  //     }

  //     if (isRequired) {
  //       required++;
  //     }

  //     total += 1;

  //     let value = owner.validate(element.source);
  //     if (!value) {
  //       valid += 1;
  //       requiredValid += isRequired ? 1 : 0;
  //     }
  //   }

  //   // create report
  //   return {
  //     required,
  //     requiredValid,
  //     total,
  //     valid,
  //     invalid: total - valid
  //   };
  // }
}
