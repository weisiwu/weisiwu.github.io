/* eslint-disable no-param-reassign */

const path = require('node:path');

if (process.env.DEBUG_LEARNING_GOALS_PERMALINK === '1') {
  hexo.log.info('[permalink-learning-goals] loaded');
}

function isLearningGoalSource(source) {
  if (!source) return false;
  const normalized = source.replace(/\\/g, '/');
  if (!normalized.includes('learning/goals/')) return false;
  if (
    normalized.endsWith('learning/goals/index.md') ||
    normalized.endsWith('learning/goals/index')
  ) {
    return false;
  }
  return normalized.endsWith('.md');
}

hexo.extend.filter.register('before_post_render', function (data) {
  if (!data) return data;

  if (!isLearningGoalSource(data.source)) return data;

  const normalized = data.source.replace(/\\/g, '/');
  const base = path.posix.basename(normalized, path.posix.extname(normalized));
  if (!base) return data;

  data.permalink = `/learning/goals/${base}/`;
  data.path = `learning/goals/${base}/index.html`;

  if (process.env.DEBUG_LEARNING_GOALS_PERMALINK === '1') {
    hexo.log.info(
      `[permalink-learning-goals] hit: source=${data.source} -> path=${data.path}`
    );
  }
  return data;
});
