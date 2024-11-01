export const invalidBulkUploadSlackMessageTemplate = (
  headerMessage: string,
  error: unknown,
  retailerId?: string
) => {
  const blocks = [
    {
      type: 'section',
      text: {
        type: 'plain_text',
        text: `❗ ${headerMessage}`,
        emoji: true,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Retailer:* ${retailerId}`,
        },
      ],
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Error:* \n \`\`\`${JSON.stringify(
            minifyAxiosError(error)
          )}\`\`\``.slice(0, 2000),
        },
      ],
    },
  ];

  return { attachments: [{ color: '#ff0000', blocks }] };
};

/* eslint-disable */
function minifyAxiosError(error) {
  if (error.name === 'AxiosError') {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
      config: {
        baseURL: error.config.baseURL,
        params: error.config.params,
        method: error.config.method,
        url: error.config.url,
        headers: error.config.headers,
        body: error.config.body,
      },
    };
  }

  return error;
}
