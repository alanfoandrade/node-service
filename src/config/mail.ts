interface IMailConfig {
  defaults: {
    from: {
      email: string;
      name: string;
    };
    region: string;
  };
  driver: 'ethereal' | 'ses';
}

export default {
  defaults: {
    from: {
      email: process.env.MAIL_USER || 'noreply@email.com',
      name: process.env.MAIL_NAME || 'NoReply',
    },
    region: process.env.AWS_DEFAULT_REGION || 'us-east-2',
  },
  driver: process.env.MAIL_DRIVER || 'ethereal',
} as IMailConfig;
