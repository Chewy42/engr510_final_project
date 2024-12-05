const { APIError, errorHandler } = require('../../src/middleware/errorHandler');

describe('Error Handler Middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;
    const originalNodeEnv = process.env.NODE_ENV;

    beforeEach(() => {
        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
    });

    afterEach(() => {
        process.env.NODE_ENV = originalNodeEnv;
    });

    describe('APIError', () => {
        test('should create error with correct properties', () => {
            const error = new APIError(400, 'Bad Request');
            
            expect(error).toBeInstanceOf(Error);
            expect(error.statusCode).toBe(400);
            expect(error.message).toBe('Bad Request');
            expect(error.status).toBe('fail');
            expect(error.isOperational).toBe(true);
        });

        test('should set status to error for 500 level codes', () => {
            const error = new APIError(500, 'Server Error');
            expect(error.status).toBe('error');
        });
    });

    describe('errorHandler', () => {
        describe('in development', () => {
            beforeEach(() => {
                process.env.NODE_ENV = 'development';
            });

            test('should return full error details', () => {
                const error = new Error('Test Error');
                error.stack = 'Error stack';

                errorHandler(error, mockReq, mockRes, mockNext);

                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(mockRes.json).toHaveBeenCalledWith({
                    status: 'error',
                    error: error,
                    message: 'Test Error',
                    stack: 'Error stack'
                });
            });
        });

        describe('in production', () => {
            beforeEach(() => {
                process.env.NODE_ENV = 'production';
            });

            test('should return operational error details', () => {
                const error = new APIError(400, 'Bad Request');

                errorHandler(error, mockReq, mockRes, mockNext);

                expect(mockRes.status).toHaveBeenCalledWith(400);
                expect(mockRes.json).toHaveBeenCalledWith({
                    status: 'fail',
                    message: 'Bad Request'
                });
            });

            test('should return generic error for non-operational errors', () => {
                const error = new Error('Internal Error');

                errorHandler(error, mockReq, mockRes, mockNext);

                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(mockRes.json).toHaveBeenCalledWith({
                    status: 'error',
                    message: 'Something went wrong'
                });
            });
        });
    });
});
