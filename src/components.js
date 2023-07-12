import { cmpId } from "./consts";

export default (editor, opts = {}) => {
  const domc = editor.DomComponents;
  const { keys } = Object;

  const barcodeProps = {
    format: [
      {
        name: "CODE128",
      },
      {
        name: "CODE39",
      },
      {
        name: "EAN13",
      },
      {
        name: "UPC",
      },
      {
        name: "EAN8",
      },
      {
        name: "EAN5",
      },
      {
        name: "EAN2",
      },
      {
        name: "ITF14",
      },
      {
        name: "MSI",
      },
      {
        name: "pharmacode",
      },
      {
        name: "codabar",
      },
    ],
    code: "123456789012",
    lineColor: "#0aa",
    width: 4,
    height: 40,
    fontSize: 20,
    textMargin: 2,
    textAlign: [
      {
        name: "left",
      },
      {
        name: "center",
      },
      {
        name: "right",
      },
    ],
    textPosition: [
      {
        name: "top",
      },
      {
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
