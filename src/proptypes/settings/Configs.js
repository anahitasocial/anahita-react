import {
  shape,
  string,
  number,
  oneOfType,
} from 'prop-types';

export default shape({
  sitename: string,
  server_domain: string,
  client_domain: string,
  template: string,
  language: string,
  mailer: string,
  mailfrom: string,
  fromname: string,
  sendmail: string,
  smtpsecure: string,
  smtpport: oneOfType([
    string,
    number,
  ]),
  smtpuser: string,
  smtppass: string,
  smtphost: string,
});
