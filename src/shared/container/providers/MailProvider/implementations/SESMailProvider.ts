/* eslint-disable no-console */
import mailConfig from '@config/mail';
import aws from 'aws-sdk';
import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';

import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

@injectable()
export default class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: mailConfig.defaults.region,
      }),
    });
  }

  public async sendMail({
    from,
    subject,
    templateData,
    to,
  }: ISendMailDTO): Promise<void> {
    const { email, name } = mailConfig.defaults.from;

    const message = await this.client
      .sendMail({
        from: {
          address: from?.email || email,
          name: from?.name || name,
        },
        html: await this.mailTemplateProvider.parse(templateData),
        subject,
        to: {
          address: to.email,
          name: to.name,
        },
      })
      .catch((error) => console.log(`Error: ${error}`));

    console.log('Message sent: %s', message?.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
