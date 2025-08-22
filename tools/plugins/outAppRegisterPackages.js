/**
 * 获取需要在外部注册的包依赖
 * @param {Object} rootPackage 根package.json对象
 * @param {Object} appPackage 应用package.json对象
 * @returns {Object} 需要外部注册的包映射
 */
export function outAppRegisterPackages(rootPackage, appPackage) {
  const packages = {};
  const { dependencies: rootDeps = {}, devDependencies: rootDevDeps = {} } =
    rootPackage;
  const { dependencies: appDeps = {}, devDependencies: appDevDeps = {} } =
    appPackage;

  Object.keys(rootDeps).forEach((key) => {
    if (!appDeps[key]) {
      packages[key] = `./node_modules/${key}`;
    }
  });
  Object.keys(rootDevDeps).forEach((key) => {
    if (!appDevDeps[key]) {
      packages[key] = `./node_modules/${key}`;
    }
  });
  return packages;
}
