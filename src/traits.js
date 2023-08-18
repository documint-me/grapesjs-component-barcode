export default function (editor, opts = {}) {
  const options = {
    name: "info-select",
  };
  const { name } = options;
  const tm = editor.Traits;
  const select = tm.getType("select");

  tm.types[name] = select.extend({
    createLabel({ label, trait: { model } }) {
      const title = model.get("info");
      return `<div class="gjs-label-wrp-2" ${title ? `title="${title}"` : ""}>
          ${label}
          ${title ? `<i class="fa-solid fa-square-info"></i>` : ""}
        </div>`;
    },
  });
}
