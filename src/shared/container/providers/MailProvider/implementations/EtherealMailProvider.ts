/* eslint-disable no-console */

import mail from '@config/mail';
import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';

import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then((account) => {
      const transporter = nodemailer.createTransport({
        auth: {
          pass: account.pass,
          user: account.user,
        },
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
      });

      this.client = transporter;
    });
  }

  public async sendMail({
    from,
    subject,
    templateData,
    to,
  }: ISendMailDTO): Promise<void> {
    const message = await this.client
      .sendMail({
        from: {
          address: from?.email || mail.defaults.from.email,
          name: from?.name || mail.defaults.from.name,
        },
        html: await this.mailTemplateProvider.parse(templateData),
        subject,
        to: {
          address: to.email,
          name: to.name,
        },
      })
      .catch((error) => console.log(`Error: ${error}`));

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
