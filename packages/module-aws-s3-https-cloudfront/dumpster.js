const { resolve } = require("path");
const { readdir } = require("fs").promises;
const { pipe, map, filter } = require("rubico");
const { includes } = require("rubico/x");

const exludesFiles = [".DS_Store"];

const getFilesWalk = ({ dir, dirResolved }) =>
  pipe([
    () => readdir(dir, { withFileTypes: true }),
    filter(({ name }) => !includes(name)(exludesFiles)),
    map((dirent) => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory()
        ? getFilesWalk({ dir: res, dirResolved })
        : res;
    }),
    (files) => files.flat(),
    map((file) => file.replace(`${dirResolved}/`, "")),
  ])();

exports.getFiles = async (dir) => {
  const dirResolved = resolve(dir);
  const files = await getFilesWalk({ dir, dirResolved });
  return files;
};
