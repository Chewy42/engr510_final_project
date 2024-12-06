import { extractErrorMessage } from '../utils/errorHandling';
import { APIError } from '../services/api';

describe('Error Handling', () => {
  describe('extractErrorMessage', () => {
    it('should handle APIError', () => {
      const error = new APIError('API error message');
      expect(extractErrorMessage(error)).toBe('API error message');
    });

    it('should handle string errors', () => {
      expect(extractErrorMessage('String error')).toBe('String error');
    });

    it('should handle Redux SerializedError', () => {
      const error = {
        name: 'Error',
        message: 'Redux error message',
        code: 'ERR_CODE'
      };
      expect(extractErrorMessage(error)).toBe('Redux error message');
    });

    it('should handle unknown errors', () => {
      expect(extractErrorMessage(null)).toBe('An unexpected error occurred');
      expect(extractErrorMessage(undefined)).toBe('An unexpected error occurred');
      expect(extractErrorMessage({})).toBe('An unexpected error occurred');
    });
  });
});
