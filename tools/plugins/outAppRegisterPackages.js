export function outAppRegisterPackages(rootPackage, appPackage) {
  const packages = {};
  const appDep = appPackage.dependencies || {};
  const appDevDep = appPackage.devDependencies || {};
  const rootDep = rootPackage.dependencies || {};
  const rootDevDep = rootPackage.devDependencies || {};

  Object.keys(rootDep).forEach((key) => {
    if (!appDep[key]) {
      packages[key] = `./node_modules/${key}`;
    }
  });
  Object.keys(rootDevDep).forEach((key) => {
    if (!appDevDep[key]) {
      packages[key] = `./node_modules/${key}`;
    }
  });
  return packages;
}
