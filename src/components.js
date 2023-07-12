import { cmpId } from "./consts";

export default (editor, opts = {}) => {
  const domc = editor.DomComponents;
  const { keys } = Object;

  const barcodeProps = {
    format: [
      {
        id: "CODE128",
        name: "CODE128",
      },
      {
        id: "CODE39",
        name: "CODE39",
      },
      {
        id: "EAN13",
        name: "EAN13",
      },
      {
        id: "UPC",
        name: "UPC",
      },
      {
        id: "EAN8",
        name: "EAN8",
      },
      {
        id: "EAN5",
        name: "EAN5",
      },
      {
        id: "EAN2",
        name: "EAN2",
      },
      {
        id: "ITF14",
        name: "ITF14",
      },
      {
        id: "MSI",
        name: "MSI",
      },
      {
        id: "pharmacode",
        name: "pharmacode",
      },
      {
        id: "codabar",
        name: "codabar",
      },
    ],
    code: "123456789012",
    lineColor: "#0aa",
    width: 2,
    height: 100,
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
    model: {
      defaults: opts.props({
        ...barcodeProps,
        tagName: "canvas",
        barcodesrc: opts.script,
        droppable: false,
        traits,
        script() {
          const int = (num) => parseInt(num, 10) || 0;
          const bool = (val) => !!val;
          const init = () => {
            const config = {
              height: int("{[ height ]}"),
              width: int("{[ width ]}"),
              lineColor: "{[ lineColor ]}",
              displayValue: bool("{[ displayValue ]}"),
              background: "transparent",
              format: "{[ format ]}",
              textMargin: int("{[ textMargin ]}"),
              textAlign: "{[ textAlign ]}",
              textPosition: "{[ textPosition ]}",
            };

            JsBarcode(this, "{[ code ]}", config);
          };

          if (!window.JsBarcode) {
            const scr = document.createElement("script");
            scr.src = "{[ barcodesrc ]}";
            scr.onload = init;
            document.body.appendChild(scr);
          } else {
            init();
          }
        },
        ...opts.barcodeComponent,
      }),

      init() {
        const events = traits.map((i) => `change:${i.name}`).join(" ");
        this.on(events, () => {
          this.trigger("change:script");
        });
      },

      afterInit() {},
    },
  });
};
