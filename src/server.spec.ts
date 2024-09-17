import { Server } from './server';
import { databaseConnection } from './common/configs/database';
import { logger } from './common/configs/logger';
import { inventoryEventListeners } from './product_store/inventory/inventory.events';

// Mock dependencies
jest.mock('./common/configs/database', () => ({
  databaseConnection: jest.fn(),
}));

jest.mock('./common/configs/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('./product_store/inventory/inventory.events', () => ({
  inventoryEventListeners: jest.fn(),
}));

describe('Server', () => {
  let server: Server;

  beforeEach(() => {
    server = new Server();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should start the server and log successful start', async () => {
    // Arrange
    (databaseConnection as jest.Mock).mockResolvedValueOnce(undefined);
    (logger.info as jest.Mock).mockImplementationOnce(() => {});
    (inventoryEventListeners as unknown as jest.Mock).mockImplementation(() => {});

    // Assert
    expect(databaseConnection).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('Server started successfully');
    expect(inventoryEventListeners);
  });

  it('should handle errors and exit process on failure', async () => {
    // Arrange
    const error = new Error('Database connection failed');
    (databaseConnection as jest.Mock).mockRejectedValueOnce(error);
    (logger.error as jest.Mock).mockImplementation(() => {});

    // Act
    // const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation((code?: number | string | undefined | null) => {
        throw new Error(`process.exit was called with code ${code}`);
      });

    // Assert
    await expect(server.start()).rejects.toThrow('process.exit was called with code 1');
    expect(databaseConnection).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(error);
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
  });
});
