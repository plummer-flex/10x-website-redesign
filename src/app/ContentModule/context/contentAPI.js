/* istanbul ignore file */
const timeout = (t = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, t));
};

export const getAllByContentType = async (props) => {
  await timeout();
  const { type } = props;
  const response = await fetch(
    `${process.env.PUBLIC_URL}/content/${type}/index.json`
  );
  const data = await response.json();
  return data;
};

export const getContentTypeByName = async (props) => {
  await timeout();
  const { type, slug } = props;
  const response = await fetch(
    `${process.env.PUBLIC_URL}/content/${type}/${slug}.json`
  );
  const data = await response.json();
  return data;
};

export const getTaxonomyByContentType = async (props) => {
  await timeout();
  const { type } = props;
  const response = await fetch(
    `${process.env.PUBLIC_URL}/content/${type}/taxonomy.json`
  );
  const data = await response.json();
  return data;
};
