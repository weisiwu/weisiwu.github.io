/* eslint-disable no-param-reassign */

import path from 'node:path';

function isLearningGoalSource(source) {
  if (!source) return false;
  const normalized = source.replace(/\\/g, '/');
  if (!normalized.startsWith('learning/goals/')) return false;
  if (normalized.endsWith('learning/goals/index.md')) return false;
  return normalized.endsWith('.md');
}

hexo.extend.filter.register('before_post_render', function (data) {
  if (!data || data.permalink) return data;

  if (!isLearningGoalSource(data.source)) return data;

  const normalized = data.source.replace(/\\/g, '/');
  const base = path.posix.basename(normalized, path.posix.extname(normalized));
  if (!base) return data;

  data.permalink = `/learning/goals/${base}/`;
  return data;
});
