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
      email: process.env.MAIL_USER,
      name: process.env.MAIL_NAME,
    },
    region: process.env.AWS_DEFAULT_REGION,
  },
  driver: process.env.MAIL_DRIVER || 'ethereal',
} as IMailConfig;
