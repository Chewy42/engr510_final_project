const { body } = require('express-validator');
const validate = require('../../src/middleware/validation');

describe('Validation Middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            body: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
    });

    test('should pass validation when rules are met', async () => {
        // Setup
        const validationRules = [
            body('email').isEmail(),
            body('password').isLength({ min: 6 })
        ];
        mockReq.body = {
            email: 'test@example.com',
            password: 'password123'
        };

        // Execute
        await validate(validationRules)(mockReq, mockRes, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
    });

    test('should return 400 when validation fails', async () => {
        // Setup
        const validationRules = [
            body('email').isEmail(),
            body('password').isLength({ min: 6 })
        ];
        mockReq.body = {
            email: 'invalid-email',
            password: '12345'
        };

        // Execute
        await validate(validationRules)(mockReq, mockRes, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            errors: [
                {
                    field: 'email',
                    message: 'Invalid value'
                },
                {
                    field: 'password',
                    message: 'Invalid value'
                }
            ]
        });
    });
});
