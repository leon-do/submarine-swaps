const asyncEach = require('async/each');
const packageJson = require('package-json');

const notFound = -1;
const requestTimeout = 408;

/** Log discrepencies between packages and their current npmjs version

  Ex: walnut.check(require('./package.json'));
*/
module.exports.check = (projectPackage) => {
  if (!projectPackage) {
    return console.log('WARN', 'No package detected for this project');
  }

  const {dependencies} = projectPackage;
  const latestVersion = {};

  return asyncEach(Object.keys(dependencies), (project, cbk) => {
    packageJson(project.toLowerCase())
      .then(data => {
        return cbk(null, latestVersion[project] = data.version);
      })
      .catch(err => {
        const {statusCode} = err;

        return cbk([statusCode, 'Failed to get latest version from npmjs']);
      });

    return;
  },
  err => {
    // Exit silently on client side request timeout errors
    if (Array.isArray(err)) {
      const [errCode] = err;

      if (errCode === requestTimeout) {
        return;
      }
    }

    if (!!err) {
      return console.log(err);
    }

    Object.keys(dependencies)
      .filter(project => dependencies[project] !== latestVersion[project])
      .forEach(project => {
        return console.log(
          project,
          'package version is',
          dependencies[project],
          'latest is',
          latestVersion[project]
        );
      });

    return;
  });
};

