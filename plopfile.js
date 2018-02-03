const promptDirectory = require('inquirer-directory');
const path = require('path');

module.exports = function(plop) {
  plop.setPrompt('directory', promptDirectory);

  const directoryActions = [
    {
      type: 'directory',
      name: 'directory',
      message: 'Where do you want to create the store?',
      basePath: __dirname
    }
  ];

  function genPath(directory, file) {
    return path.resolve(__dirname, directory, file);
  }

  plop.setGenerator('DA Store', {
    description: 'Datorama store',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Store name'
      }
    ].concat(directoryActions),
    actions: function(data) {
      return [
        {
          type: 'add',
          path: genPath(data.directory, "./config/{{'dashCase' name}}.model.ts"),
          templateFile: './templates/model.tpl'
        },
        {
          type: 'add',
          path: genPath(data.directory, "./config/{{'dashCase' name}}.providers.ts"),
          templateFile: './templates/providers.tpl'
        },
        {
          type: 'add',
          path: genPath(data.directory, "./config/{{'dashCase' name}}.store.ts"),
          templateFile: './templates/store.tpl'
        },
        {
          type: 'add',
          path: genPath(data.directory, "./config/{{'dashCase' name}}.service.ts"),
          templateFile: './templates/service.tpl'
        },
        {
          type: 'add',
          path: genPath(data.directory, "./config/{{'dashCase' name}}-data.service.ts"),
          templateFile: './templates/data-service.tpl'
        },
        {
          type: 'add',
          path: genPath(data.directory, "./config/{{'dashCase' name}}.query.ts"),
          templateFile: './templates/query.tpl'
        }
      ];
    }
  });
};
