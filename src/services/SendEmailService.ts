import { sesClient } from '@/lib/aws';
import { SendEmailCommand } from '@aws-sdk/client-ses';

interface ISendEmailParams {
  subject: string;
  toEmail: string;
  fromEmail: string;
  html: string;
  returnToEmail: string;
}

export class SendEmailService {
  paramsForEmail: any;

  constructor({
    fromEmail,
    html,
    returnToEmail,
    subject,
    toEmail,
  }: ISendEmailParams) {
    this.paramsForEmail = {
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: html,
          },
        },
        Subject: { Data: subject },
      },
      Source: fromEmail,
      ReturnPath: returnToEmail,
    };
  }

  async sendEmail() {
    await sesClient.send(new SendEmailCommand(this.paramsForEmail));
  }
}
