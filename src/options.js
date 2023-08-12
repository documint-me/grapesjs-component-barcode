import { cmpId } from "./consts";

export default {
  blocks: [cmpId],
  // default options
  script:
    "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js",
  api: "https://barcodes-xdm4ptfota-uc.a.run.app/api/v1/barcodes",
  // Object to extend the default block, eg. `{ label: '', ... }`
  // Pass a falsy value to avoid adding the block
  blockBarcode: {},

  // Customize the component props. The final object should be returned
  // from the function.
  /**
  eg. Here an example of how you would customize component's traits
  `props => {
      props.traits = props.traits.map(trait => {
        if (trait.name == 'strings') {
          trait.label = 'Custom <b>trait<b/> label';
        }
        // this trait will be removed
        if (trait.name == 'theme') return;
        return trait;
      }).filter(i => i);
      return props;
  }`
 */
  props: (i) => i,
  // Component props
  barcodeComponent: {},
};
