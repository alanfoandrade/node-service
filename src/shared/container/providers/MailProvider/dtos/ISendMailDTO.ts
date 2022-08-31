import IParseMailTemplateDTO from '../../MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IMailContact {
  email: string;
  name: string;
}

export default interface ISendMailDTO {
  from?: IMailContact;
  subject: string;
  templateData: IParseMailTemplateDTO;
  to: IMailContact;
}
