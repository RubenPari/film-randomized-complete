import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailService } from './email.service.js';

jest.mock('nodemailer');

describe('EmailService', () => {
  const sendMail = jest.fn().mockResolvedValue(undefined);
  const configValues: Record<string, string> = {};
  const configService = {
    get: jest.fn((key: string) => configValues[key]),
  } as unknown as ConfigService;

  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    for (const key of Object.keys(configValues)) delete configValues[key];
    (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail });
    // Nest Logger.warn writes to process.stdout.write — swallow it so the
    // suite output is clean when asserting the "no Mailtrap" branch.
    warnSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('skips sending when MAILTRAP_TOKEN is not configured', async () => {
    const service = new EmailService(configService);

    await service.sendPasswordResetEmail('user@example.com', 'tok');

    expect(nodemailer.createTransport).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('sends a reset email with a link derived from FRONTEND_URL', async () => {
    configValues.MAILTRAP_TOKEN = 'mt-token';
    configValues.FRONTEND_URL = 'https://app.example.com';
    configValues.MAILTRAP_SENDER_EMAIL = 'noreply@example.com';

    const service = new EmailService(configService);
    await service.sendPasswordResetEmail('user@example.com', 'tok');

    expect(sendMail).toHaveBeenCalledTimes(1);
    const call = sendMail.mock.calls[0][0];
    expect(call.to).toBe('user@example.com');
    expect(call.from).toBe('noreply@example.com');
    expect(call.html).toContain(
      'https://app.example.com/reset-password?token=tok',
    );
  });

  it('falls back to defaults when optional email fields are missing', async () => {
    configValues.MAILTRAP_TOKEN = 'mt-token';

    const service = new EmailService(configService);
    await service.sendPasswordResetEmail('user@example.com', 'tok');

    const call = sendMail.mock.calls[0][0];
    expect(call.from).toBe('noreply@filmrandomized.com');
    expect(call.html).toContain('http://localhost:5173/reset-password?token=tok');
  });
});
