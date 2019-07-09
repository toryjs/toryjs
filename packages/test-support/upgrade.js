const baseForm = JSON.parse(
  '{"control":"Form","elements":[{"control":"Table","elements":[{"props":{},"uid":"1558922906783"}],"props":{"items":[{"title":"Insp. Date","source":"inspection_date","type":"string"},{"title":"Ms. Folio","source":"ms_21935_folio","type":"number"},{"title":"Conf. Folio","source":"customs_register_folio","type":"string"},{"title":"Conf. Reg. Ms","source":"customs_register_ms","type":"number"},{"title":"Collector","source":"adressee","type":"string"}],"control":"Table","hideEditor":true,"locked":true},"uid":"1558922906784"}],"pages":[{"control":"Form","label":"Detail","props":{"locked":true},"uid":"1558922906785"}],"label":"List","props":{},"uid":"1558922906786"}'
);
function setProp(obj, name, value, del = name) {
  if (!obj.props) {
    obj.props = {};
  }
  obj.props[name] = value;
  delete obj[del];
}
function process(obj) {
  if (!obj) {
    return;
  }
  if (obj.control === 'Text') {
    setProp(obj, 'value', obj.label || obj.props.text, 'label');
    delete obj.props.text;
  }
  if (obj.label) {
    setProp(obj, 'label', obj.label);
  }
  if (obj.source) {
    setProp(obj, 'value', { source: obj.source }, 'source');
  }
  if (obj.readonly != null) {
    setProp(obj, 'readonly', obj.readonly);
  }

  if (obj.elements) {
    for (let el of obj.elements) {
      process(el);
    }
  }
  if (obj.pages) {
    for (let el of obj.pages) {
      process(el);
    }
  }
  if (obj.form) {
    process(obj.form);
  }
}
process(baseForm);
console.log(JSON.stringify(JSON.stringify(baseForm)));
