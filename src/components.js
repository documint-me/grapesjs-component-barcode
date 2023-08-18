import { cmpId } from "./consts";
import Barcode from "jsbarcode";

export default (editor, opts = {}) => {
  const domc = editor.DomComponents;
  const { keys } = Object;

  const formats = [
    {
      id: "CODE128",
      name: `auto(CODE128)`,
      default: "123456789012",
    },
    {
      id: "CODE39",
      name: "CODE39",
      default: "123456789012",
    },
    {
      id: "EAN13",
      name: "EAN13",
      default: "1234567890128",
    },
    {
      id: "UPC",
      name: "UPC",
      default: "123456789012",
    },
    {
      id: "EAN8",
      name: "EAN8",
      default: "1234567",
    },
    {
      id: "EAN5",
      name: "EAN5",
      default: "12345",
    },
    {
      id: "EAN2",
      name: "EAN2",
      default: "12",
    },
    {
      id: "ITF14",
      name: "ITF14",
      default: "1234567890124",
    },
    {
      id: "MSI",
      name: "MSI",
      default: "123456789012",
    },
    {
      id: "pharmacode",
      name: "pharmacode",
      default: "123456",
    },
    {
      id: "codabar",
      name: "codabar",
      default: "123456789012",
    },
  ];
  const barcodeProps = {
    format: formats,
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
    if (typeof value == "object") return "info-select";
    if (value.startsWith("#")) return "color";
    return "text";
  };

  const traits = keys(barcodeProps).map((name) => {
    const title = name === "format" ? { info: opts.formatInfo } : {};
    return {
      changeProp: 1,
      type: getTraitType(barcodeProps[name]),
      options: barcodeProps[name],
      min: 0,
      placeholder: "placeholder",
      name,
      ...title,
    };
  });

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
        this.on("change:format", this.setDefaults);
        this.on("change:code", this.validateBarcode);
        this.generateBarcodeImage();
        this.afterInit();
      },

      generateBarcodeImage() {
        const params = new URLSearchParams({
          // height: this.get("height"),
          // width: this.get("width"),
          fontSize: this.get("fontSize"),
          lineColor: this.get("lineColor"),
          displayValue: this.get("displayValue"),
          format: this.get("format"),
          textMargin: this.get("textMargin"),
          textAlign: this.get("textAlign"),
          textPosition: this.get("textPosition"),
        });
        this.set({
          src: `${opts.api}?code=${this.get("code")}&${params.toString()}`,
        });
      },

      validateBarcode() {
        const canvas = document.createElement("canvas");
        try {
          Barcode(canvas, this.get("code"), { format: this.get("format") });
          return true;
        } catch (error) {
          this.setDefaults();
          return false;
        }
      },

      setDefaults() {
        const format = this.get("format");
        const code = formats.find((f) => f.id === format).default;
        this.set({ code });
      },

      afterInit() {},
    },
    view: {
      onActive(ev) {},
    },
  });
};
