// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  FormDataSet as FormDataSetModel,
  SchemaDataSet as SchemaDataSetModel,
  ProjectDataSet as ProjectDataSetModel,
  StateDataSet as StateDataSetModel
} from './form_store';

declare global {
  namespace DynamicForm {
    type FormDataSet = FormDataSetModel;
    type SchemaDataSet = SchemaDataSetModel;
    type ProjectDataSet = ProjectDataSetModel;
    type StateDataSet = StateDataSetModel;
  }
}
