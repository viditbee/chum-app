/* eslint-disable no-template-curly-in-string */
const MockDataForTasks = {
  tasksConfiguration: [
    {
      taskName: 'Create imagery',
      taskId: 'ci123',
      params: {
        taskType: 'create_imagery',
        importance: '${taskC_importance}',
        assigneeId: '${taskC_assigneeId}',
        groupId: '${taskC_groupId}',
      },
    },
    {
      taskName: 'Author copy',
      taskId: 'ac123',
      params: {
        taskType: 'author_copy',
        importance: '${taskA_importance}',
        assigneeId: '${taskA_assigneeId}',
        groupId: '${taskA_groupId}',
      },
    },
    {
      taskName: 'Review content',
      taskId: 'rc123',
      params: {
        taskType: 'review_content',
        importance: '${taskB_importance}',
        assigneeId: '${taskB_assigneeId}',
        groupId: '${taskB_groupId}',
      },
    },
  ],
};

module.exports = MockDataForTasks;
