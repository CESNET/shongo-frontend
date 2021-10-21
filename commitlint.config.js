const Configuration = {
  extends: ["@commitlint/config-conventional"],
  ignores: [(commit) => commit.includes("initial commit")],
  defaultIgnores: true,
};
module.exports = Configuration;
