const { projectValidation, projectUpdateValidation, projectIdValidation } = require('../../src/validators/project.validator');
const { validationResult } = require('express-validator');

describe('Project Validators', () => {
    let mockReq;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {}
        };
    });

    const runValidation = async (validations, req) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        return validationResult(req);
    };

    describe('projectValidation', () => {
        test('should pass with valid project data', async () => {
            mockReq.body = {
                name: 'Test Project',
                description: 'A test project description',
                methodology: 'agile',
                target_completion_date: '2024-12-31'
            };

            const result = await runValidation(projectValidation, mockReq);
            expect(result.isEmpty()).toBe(true);
        });

        test('should fail with invalid project name', async () => {
            mockReq.body = {
                name: '',
                methodology: 'agile'
            };

            const result = await runValidation(projectValidation, mockReq);
            expect(result.isEmpty()).toBe(false);
            expect(result.array()).toContainEqual(
                expect.objectContaining({
                    path: 'name',
                    msg: 'Project name is required'
                })
            );
        });

        test('should fail with invalid methodology', async () => {
            mockReq.body = {
                name: 'Test Project',
                methodology: 'invalid'
            };

            const result = await runValidation(projectValidation, mockReq);
            expect(result.isEmpty()).toBe(false);
            expect(result.array()).toContainEqual(
                expect.objectContaining({
                    path: 'methodology',
                    msg: 'Invalid methodology type'
                })
            );
        });

        test('should fail with past completion date', async () => {
            mockReq.body = {
                name: 'Test Project',
                methodology: 'agile',
                target_completion_date: '2020-01-01'
            };

            const result = await runValidation(projectValidation, mockReq);
            expect(result.isEmpty()).toBe(false);
            expect(result.array()).toContainEqual(
                expect.objectContaining({
                    path: 'target_completion_date',
                    msg: 'Target completion date must be in the future'
                })
            );
        });
    });

    describe('projectUpdateValidation', () => {
        test('should pass with valid update data', async () => {
            mockReq.body = {
                name: 'Updated Project',
                methodology: 'waterfall',
                status: 'in_progress'
            };

            const result = await runValidation(projectUpdateValidation, mockReq);
            expect(result.isEmpty()).toBe(true);
        });

        test('should fail with invalid status', async () => {
            mockReq.body = {
                name: 'Updated Project',
                status: 'invalid_status'
            };

            const result = await runValidation(projectUpdateValidation, mockReq);
            expect(result.isEmpty()).toBe(false);
            expect(result.array()).toContainEqual(
                expect.objectContaining({
                    path: 'status',
                    msg: 'Invalid project status'
                })
            );
        });
    });

    describe('projectIdValidation', () => {
        test('should pass with valid project ID', async () => {
            mockReq.params = { id: '123' };

            const result = await runValidation(projectIdValidation, mockReq);
            expect(result.isEmpty()).toBe(true);
        });

        test('should fail with invalid project ID', async () => {
            mockReq.params = { id: 'abc' };

            const result = await runValidation(projectIdValidation, mockReq);
            expect(result.isEmpty()).toBe(false);
            expect(result.array()).toContainEqual(
                expect.objectContaining({
                    path: 'id',
                    msg: 'Invalid project ID'
                })
            );
        });
    });
});
