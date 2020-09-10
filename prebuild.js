const path = require("path");
const fs = require("fs");
const markdown = require("remark");
const slug = require("remark-slug");
const parse = require("remark-parse");
const slugLink = require("remark-autolink-headings");
const extractToc = require("remark-extract-toc");
const YAML = require("yaml");

const excludedPathTypes = ["page"];

const parseHeading = (item, data = []) => {
  data.push({ text: item.value, url: `#${item.data.id}` });
};

const parseToc = (items, data) => {
  items.forEach((item) => {
    parseHeading(item, data);
    if (item.children) {
      parseToc(item.children, data);
    }
  });
};

const excerpt = () => (tree = [], vfile) => {
  let excerpt = tree.children.find((item) => item.type === "paragraph");
  if (excerpt) {
    vfile.data.excerpt = excerpt.children[0].value;
  }
  return tree;
};

/**
 * Set up Remark instances
 */
const remark = markdown().use(parse).use(slug).use(slugLink).use(excerpt);

// separate because extractToc doesn't play nice.
const remarkToc = markdown()
  .use(parse)
  .use(slug)
  .use(slugLink)
  .use(extractToc, { keys: ["data"] });

const getConfig = () =>
  YAML.parse(
    fs.readFileSync(path.join(__dirname, "/public/admin/config.yml"), "utf-8")
  );

/**
 * Verify that a content path exists
 * @param {*} cPath
 */
const verifyConfigPath = (cPath) => {
  if (!fs.existsSync(cPath)) {
    console.log(`${cPath} not found! Creating directory...`);
    fs.mkdirSync(cPath);
  }
};

/**
 * Write a single content file
 * @param {*} data
 * @param {*} filePath
 */
const writeFile = (data, filePath) => {
  fs.writeFileSync(filePath, JSON.stringify(data));
  console.log(`${filePath}: Updated file contents.`);
};

/**
 * Return and parse a JSON file content
 * @param {*} filePath
 */
const getFileData = (filePath) => {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
};

/**
 * Append a file with metadata
 * @param {*} file
 */
const addContentMetaData = (filename, filePath, collection) => {
  const fileData = getFileData(path.join(filePath, filename));
  fileData.type = collection.name;
  fileData.name = filename.replace(/\.json/, "");
  fileData.path = `/${
    excludedPathTypes.includes(fileData.type) ? "" : `${fileData.type}/`
  }${fileData.name}`;

  const process = remark.processSync(fileData.body);

  fileData.excerpt = process.data.excerpt;
  fileData.body = process.toString();

  const node = remarkToc.parse(fileData.body);
  const headings = remarkToc.runSync(node);
  const toc = [];
  parseToc(headings, toc);
  fileData.toc = toc;
  return fileData;
};

/**
 * Extracts taxonomy data for a file dataset
 * @param fields {Array} Array of meta fields
 */
const extractTaxonomyData = (field) => {
  const { key, title, value } = field;
  return { key, title, items: [value] };
};

/**
 * Indexes Taxonomy data for a given contentIndex
 * to be run as a reduce function
 * @param {Array} data
 * @param {Object} fileName
 */
const indexTaxonomies = (index, fileData) => {
  let newData = [...index];
  // does the property 'field' exist in fileData?
  if ("fields" in fileData) {
    fileData.fields.forEach((field) => {
      const fieldData = extractTaxonomyData(field);
      // check if key already exists in acc for the current item
      const exists = newData.find((n) => n.key === fieldData.key);

      // If the key doesn't exist in the index, add it
      if (!Boolean(exists)) {
        newData.push(fieldData);
        return;
      }
      // If a key was found and does not include the current value, add it
      if (!exists.items.includes(fieldData.items[0])) {
        exists.items.push(fieldData.items[0]);
        newData = newData.filter((item) => item.key !== fieldData.key);
        newData.push(exists);
      }
    });
  }
  return newData;
};

/**
 * From a defined directory, see that content exists
 * @param {*} rootDir
 */
const indexContent = () => {
  const config = getConfig();
  const collections = config.collections.filter((col) =>
    col.folder.includes("content")
  );
  // iterate over the specified Content types
  collections.forEach((collection) => {
    const collectionPath = path.join(__dirname, collection.folder);
    verifyConfigPath(collectionPath);

    const contents = fs
      .readdirSync(collectionPath)
      .filter(
        (filename) => filename !== "index.json" && filename.includes(".json")
      );
    const contentIndex = contents.map((filename) => {
      const data = addContentMetaData(filename, collectionPath, collection);
      writeFile(data, path.join(collectionPath, filename));
      return data;
    });

    const taxonomyIndex = contentIndex.reduce(indexTaxonomies, []);

    writeFile(contentIndex, path.join(collectionPath, "index.json"));
    if (taxonomyIndex.length) {
      writeFile(taxonomyIndex, path.join(collectionPath, "taxonomy.json"));
    }
  });
};

const indexMenus = () => {
  const config = getConfig();
  const menus = config.collections.filter((col) => col.folder.includes("menu"));
  menus.forEach((menu) => {
    const menuPath = path.join(__dirname, menu.folder);
    verifyConfigPath(menuPath);

    const contents = fs
      .readdirSync(menuPath)
      .filter(
        (filename) => filename.includes(".json") && filename !== "index.json"
      );

    const menuIndex = contents.map((filename) => {
      const file = fs.readFileSync(path.join(menuPath, filename), "utf-8");
      return JSON.parse(file);
    });

    if (menuIndex.length) {
      writeFile(menuIndex, menuPath);
    }
  });
};

indexContent();
indexMenus();
