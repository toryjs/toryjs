import { JSONSchema } from './json_schema';
import { FormElement } from './form_definition';

type Resource = {
  type: string;
  content?: string;
};

export function generateSchema(schema: any, resources: Resource[]) {
  throw new Error('Not implemented ...');

  const forms = resources.filter(r => r.type === 'Form');
  const finalSchema: JSONSchema = {
    ...schema,
    properties: {}
  };

  for (let form of forms) {
    let f = JSON.parse(form.content) as FormElement;

    copyElements(f.elements, schema, finalSchema);
  }
  return finalSchema;
}

function copyElements(
  formElements: FormElement[],
  originalSchema: JSONSchema,
  newSchema: JSONSchema
) {
  // for (let elem of formElements) {
  //   copyProperties(originalSchema, newSchema, elem.source.split('.'));
  //   // remove all properties from "required" list that no longer appear in the new list of properties
  //   if (originalSchema.required) {
  //     newSchema.required = [...originalSchema.required];
  //     let newKeys = Object.getOwnPropertyNames(newSchema.properties);
  //     for (let i = newSchema.required.length - 1; i >= 0; i--) {
  //       let key = newSchema.required[i];
  //       if (newKeys.indexOf(key) === -1) {
  //         newSchema.required.splice(i, 1);
  //       }
  //     }
  //   }
  //   if (elem.elements && elem.elements.length) {
  //     copyElements(
  //       elem.elements,
  //       originalSchema.properties[elem.source],
  //       newSchema.properties[elem.source]
  //     );
  //   }
  // }
}

function copyProperties(originalSchema: JSONSchema, newSchema: JSONSchema, parts: string[]) {
  // // console.log('==========================================');
  // // console.log(parts);
  // // console.log(originalSchema);
  // // console.log(newSchema);
  // // console.log(newSchema.properties);
  // let part = parts.shift();
  // if (!newSchema.properties) {
  //   newSchema.properties = {};
  // }
  // let extractedSchema = originalSchema.properties[part];
  // if (!extractedSchema) {
  //   throw new Error(`Schema ${JSON.stringify(originalSchema)} does not have a parameters ${part}`);
  // }
  // originalSchema = extractedSchema;
  // // take all parameters from the current object apart from its properties
  // // and merge it with the existing object
  // const { properties, ...rest } = originalSchema;
  // // console.log(newSchema.properties[part]);
  // // console.log(rest);
  // newSchema.properties[part] = { ...newSchema.properties[part], ...rest };
  // // console.log(newSchema);
  // // console.log(parts);
  // if (parts.length > 0) {
  //   copyProperties(originalSchema, newSchema.properties[part], parts);
  // }
}
