import loadComponents from "./components";
import loadBlocks from "./blocks";
import defaultOptions from "./options";
import loadTraits from "./traits";

export default (editor, opts = {}) => {
  const options = {
    ...defaultOptions,
    ...opts,
  };

  // Add traits
  loadTraits(editor, options);

  // Add components
  loadComponents(editor, options);

  // Add blocks
  loadBlocks(editor, options);
};
