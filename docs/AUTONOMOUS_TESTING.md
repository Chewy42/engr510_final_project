# Autonomous Testing Guide

## Overview
This guide outlines the systematic approach for autonomous testing and debugging in our React TypeScript project. It provides a framework for AI assistants to independently analyze, plan, and execute testing strategies.

## Testing Philosophy
1. **Systematic Analysis**: Always begin with understanding the full context before making changes
2. **Incremental Progress**: Address issues one at a time, validating each fix
3. **Root Cause Focus**: Look for underlying issues rather than just symptoms
4. **Documentation First**: Document changes and reasoning for future reference

## Step-by-Step Testing Process

### 1. Initial Assessment
- Review project structure and existing tests
- Identify test configuration files (jest.config.js, package.json test scripts)
- Check for common setup files (setupTests.ts)
- Review dependencies in package.json

### 2. Environment Validation
```checklist
[ ] Verify all required dependencies are installed
[ ] Check for conflicting dependency versions
[ ] Validate test configuration settings
[ ] Ensure environment variables are properly set
```

### 3. Test Analysis Strategy
a) **For Failed Tests**:
   1. Analyze error messages thoroughly
   2. Check import paths and module resolution
   3. Review test environment setup
   4. Verify mock implementations
   5. Check for async/timing issues

b) **For New Tests**:
   1. Identify critical functionality to test
   2. Plan test coverage strategy
   3. Consider edge cases
   4. Design test data

### 4. Common Issues and Solutions

#### Dependency Issues
- Update package.json configuration:
  ```json
  {
    "jest": {
      "transformIgnorePatterns": [
        "node_modules/(?!(axios|react-router-dom|@heroicons)/)"
      ],
      "moduleNameMapper": {
        "^axios$": "axios/dist/node/axios.cjs",
        "^@/(.*)$": "<rootDir>/src/$1"
      }
    }
  }
  ```

#### Testing Library Best Practices
- Use @testing-library/react instead of @testing-library/react-hooks
- Prefer user-centric queries (getByRole, getByLabelText)
- Use data-testid as a last resort
- Implement proper cleanup in afterEach blocks

### 5. Testing Workflow

1. **Plan Phase**
   ```markdown
   - Identify test scope
   - List components/features to test
   - Define expected behaviors
   - Plan mock requirements
   ```

2. **Implementation Phase**
   ```markdown
   - Write/update test files
   - Implement mocks and fixtures
   - Add test utilities as needed
   ```

3. **Validation Phase**
   ```markdown
   - Run specific test file
   - Run related test suite
   - Run full test suite
   - Check coverage reports
   ```

4. **Documentation Phase**
   ```markdown
   - Document test patterns used
   - Note any workarounds implemented
   - Update testing documentation
   ```

### 6. Critical Thinking Framework

When encountering issues, follow this thought process:

1. **Observe**
   - What is the exact error message?
   - When does the error occur?
   - What changed recently?

2. **Hypothesize**
   - What could cause this behavior?
   - Are there similar patterns elsewhere?
   - What are the dependencies involved?

3. **Test**
   - Create minimal reproduction
   - Isolate variables
   - Verify assumptions

4. **Implement**
   - Apply fix systematically
   - Document changes
   - Verify no regression

### 7. Example Problem-Solving Chain

```markdown
Problem: Component test failing with "Unable to find role"

1. Analysis:
   - Check if component renders correctly
   - Verify ARIA roles are present
   - Check testing library queries

2. Investigation:
   - Review component markup
   - Check accessibility patterns
   - Verify test setup

3. Solution:
   - Add missing ARIA roles
   - Update test queries
   - Add test utilities if needed

4. Validation:
   - Run component tests
   - Check accessibility
   - Document changes
```

## Best Practices

1. **Test Organization**
   - Group related tests
   - Use descriptive test names
   - Maintain test isolation

2. **Code Quality**
   - Follow testing patterns
   - Keep tests focused
   - Avoid test interdependence

3. **Maintenance**
   - Regular dependency updates
   - Coverage monitoring
   - Documentation updates

## Troubleshooting Guide

### Common Error Patterns

1. **Module Resolution Issues**
   ```markdown
   - Check tsconfig.json paths
   - Verify import statements
   - Check module aliases
   ```

2. **Async Testing Problems**
   ```markdown
   - Use act() when needed
   - Proper async/await usage
   - Check timing issues
   ```

3. **State Management Testing**
   ```markdown
   - Verify store setup
   - Check reducer logic
   - Test state changes
   ```

## Conclusion

This guide provides a framework for autonomous testing. Follow these patterns and adapt them as needed for specific testing scenarios. Remember to document any new patterns or solutions discovered during testing.
