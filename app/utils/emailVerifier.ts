import dns from 'dns';
import net from 'net';

interface VerificationResult {
  email: string;
  isValid: boolean;
  reason: string;
  isCatchAll?: boolean;
  isDisposable?: boolean;
  isFreeProvider?: boolean;
  isRole?: boolean;
  suggestedCorrection?: string;
}

const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
const roleEmails = ['info', 'admin', 'support', 'sales', 'contact'];
const disposableDomains = ['temp-mail.org', 'guerrillamail.com']; // Add more as needed

export const verifyEmail = async (email: string): Promise<VerificationResult> => {
  // Email syntax check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!emailRegex.test(email)) {
    return { email, isValid: false, reason: 'Invalid email format' };
  }

  const [localPart, domain] = email.split('@');

  // Domain check
  let mxRecords;
  try {
    mxRecords = await new Promise<dns.MxRecord[]>((resolve, reject) => {
      dns.resolveMx(domain, (err, addresses) => {
        if (err) reject(err);
        else resolve(addresses);
      });
    });
  } catch (error) {
    return { email, isValid: false, reason: 'Invalid domain or no MX records found' };
  }

  // SMTP test
  const isValidSMTP = await smtpTest(mxRecords[0].exchange, email);
  if (!isValidSMTP) {
    return { email, isValid: false, reason: 'Failed SMTP check' };
  }

  // Catch-all test
  const isCatchAll = await catchAllTest(mxRecords[0].exchange, domain);

  // Disposable test
  const isDisposable = disposableDomains.includes(domain);

  // Free provider detection
  const isFreeProvider = freeProviders.includes(domain);

  // Role detection
  const isRole = roleEmails.includes(localPart.toLowerCase());

  // Typo correction
  let suggestedCorrection = undefined;
  if (domain === 'gmial.com') suggestedCorrection = email.replace('gmial.com', 'gmail.com');

  return {
    email,
    isValid: true,
    reason: 'Valid email',
    isCatchAll,
    isDisposable,
    isFreeProvider,
    isRole,
    suggestedCorrection,
  };
};

const smtpTest = (host: string, email: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let responseCode = 0;
    
    socket.connect(25, host, () => {
      socket.write(`HELO example.com\r\n`);
    });

    socket.on('data', (data) => {
      const response = data.toString();
      const code = parseInt(response.substr(0, 3));
      
      if (responseCode === 0) {
        responseCode = code;
        socket.write(`MAIL FROM: <verify@example.com>\r\n`);
      } else if (responseCode === 250 && code === 250) {
        socket.write(`RCPT TO: <${email}>\r\n`);
      } else if (code === 250 || code === 251) {
        socket.destroy();
        resolve(true);
      } else {
        socket.destroy();
        resolve(false);
      }
    });

    socket.on('error', () => {
      resolve(false);
    });
  });
};

const catchAllTest = (host: string, domain: string): Promise<boolean> => {
  const randomEmail = `test-${Math.random().toString(36).substring(7)}@${domain}`;
  return smtpTest(host, randomEmail);
};

export const removeDuplicates = (emails: string[]): string[] => {
  return [...new Set(emails)];
};