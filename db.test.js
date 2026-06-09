describe('database configuration', () => {
  const originalEnv = process.env;
  const mockCreatePool = jest.fn();

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    mockCreatePool.mockClear();
    jest.doMock('mysql2/promise', () => ({
      createPool: mockCreatePool.mockReturnValue({
        execute: jest.fn(),
        end: jest.fn(),
      }),
    }));
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.dontMock('mysql2/promise');
  });

  test('does not enable ssl when DB_CA_CERT_BASE64 is blank', () => {
    process.env.DB_CA_CERT_BASE64 = '     ';

    require('./db');

    expect(mockCreatePool).toHaveBeenCalledTimes(1);
    expect(mockCreatePool.mock.calls[0][0]).not.toHaveProperty('ssl');
  });

  test('enables ssl when DB_CA_CERT_BASE64 is present', () => {
    process.env.DB_CA_CERT_BASE64 = Buffer.from('CERT DATA').toString('base64');

    require('./db');

    expect(mockCreatePool).toHaveBeenCalledTimes(1);
    expect(mockCreatePool.mock.calls[0][0]).toMatchObject({
      ssl: {
        ca: 'CERT DATA',
      },
    });
  });
});
