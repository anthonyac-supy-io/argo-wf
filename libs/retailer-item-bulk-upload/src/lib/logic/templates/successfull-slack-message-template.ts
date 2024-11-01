import { WorkflowStatus } from '../../common';

export const bulkUploadFinalisedSlackMessageTemplate = (
  type: WorkflowStatus,
  retailerId?: string
) => {
  const blocks = [
    {
      type: 'section',
      text: {
        type: 'plain_text',
        text: `${
          type === WorkflowStatus.Succeeded ? `✅` : `❗`
        } Retailer Item Bulk Upload ${type}`,
        emoji: true,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Retailer:* ${retailerId}`, // check if we have access to retailer name also
        },
      ],
    },
  ];

  return { attachments: [{ color: '#ff0000', blocks }] };
};
