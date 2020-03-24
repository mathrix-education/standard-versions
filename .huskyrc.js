const tasks = commands => commands.join(' && ');

module.exports = {
  hooks: {
    'pre-commit': tasks(['npm run lint', 'npm run build', 'git add dist/']),
  },
};
