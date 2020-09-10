/* istanbul ignore file */

const testData = [{ title: "test 1" }, { title: "test 2" }];

const testTax = [
  { key: "testTax", title: "test tax", items: ["testtax1", "testtax2"] },
];

export const getAllByContentType = async (props) => {
  if (props.type === "error") {
    throw new Error("Invalid Type.");
  }
  return testData;
};

export const getContentTypeByName = async (props) => {
  if (props.type === "error") {
    throw new Error("Invalid Type.");
  }
  if (!props.name) {
    throw new Error("Invalid Name.");
  }
  return testData[0];
};

export const getTaxonomyByContentType = async (props) => {
  if (props.type === "error") {
    throw new Error("Invalid Type.");
  }
  return testTax;
};
