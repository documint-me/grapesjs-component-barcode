import { cmpId } from "./consts";

export default (editor, opts = {}) => {
  const domc = editor.DomComponents;
  const { keys } = Object;

  const barcodeProps = {
    //format: [
    //  {
    //    id: "CODE128",
    //    name: "CODE128",
    //    default: "123456789012",
    //  },
    //  {
    //    id: "CODE39",
    //    name: "CODE39",
    //    default: "",
    //  },
    //  {
    //    id: "EAN13",
    //    name: "EAN13",
    //    default: "1234567890128",
    //  },
    //  {
    //    id: "UPC",
    //    name: "UPC",
    //    default: "123456789012",
    //  },
    //  {
    //    id: "EAN8",
    //    name: "EAN8",
    //    default: "",
    //  },
    //  {
    //    id: "EAN5",
    //    name: "EAN5",
    //    default: "",
    //  },
    //  {
    //    id: "EAN2",
    //    name: "EAN2",
    //    default: "",
    //  },
    //  {
    //    id: "ITF14",
    //    name: "ITF14",
    //    default: "",
    //  },
    //  {
    //    id: "MSI",
    //    name: "MSI",
    //    default: "",
    //  },
    //  {
    //    id: "pharmacode",
    //    name: "pharmacode",
    //    default: "1234",
    //  },
    //  {
    //    id: "codabar",
    //    name: "codabar",
    //    default: "",
    //  },
    //],
    code: "123456789012",
    lineColor: "#0aa",
    // width: 2,
    // height: 100,
    fontSize: 20,
    textMargin: 2,
    textAlign: [
      {
        id: "left",
        name: "left",
      },
      {
        id: "center",
        name: "center",
      },
      {
        id: "right",
        name: "right",
      },
    ],
    textPosition: [
      {
        id: "top",
        name: "top",
      },
      {
        id: "bottom",
        name: "bottom",
      },
    ],
    displayValue: true,
  };

  const getTraitType = (value) => {
    if (typeof value == "number") return "number";
    if (typeof value == "boolean") return "checkbox";
    if (typeof value == "object") return "select";
    if (value.startsWith("#")) return "color";
    return "text";
  };

  const traits = keys(barcodeProps).map((name) => ({
    changeProp: 1,
    type: getTraitType(barcodeProps[name]),
    options: barcodeProps[name],
    min: 0,
    placeholder: "placeholder",
    name,
  }));

  barcodeProps.format = "CODE128";
  barcodeProps.textAlign = "center";
  barcodeProps.textPosition = "bottom";

  domc.addType(cmpId, {
    extend: "image",
    model: {
      defaults: opts.props({
        ...barcodeProps,
        barcodesrc: opts.script,
        droppable: false,
        traits,
        ...opts.barcodeComponent,
      }),

      init() {
        const events = traits.map((i) => `change:${i.name}`).join(" ");
        this.on(events, this.generateBarcodeImage);
        this.generateBarcodeImage();
        this.afterInit();
      },

      generateBarcodeImage() {
        const params = new URLSearchParams({
          code: this.get("code"),
          // height: this.get("height"),
          // width: this.get("width"),
          fontSize: this.get("fontSize"),
          lineColor: this.get("lineColor"),
          displayValue: this.get("displayValue"),
          // format: this.get("format"),
          textMargin: this.get("textMargin"),
          textAlign: this.get("textAlign"),
          textPosition: this.get("textPosition"),
        });
        this.set({ src: `${opts.api}?${params.toString()}` });
      },

      afterInit() {},
    },
    view: {
      onActive(ev) {},
    },
  });
};
