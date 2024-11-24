# AI Development Instructions

## Overview
This document provides instructions for AI agents working on ProjectFlow, a modern project management application. The AI should focus on delivering high-quality, maintainable code while adhering to modern development practices and user experience principles.

## Core Principles

### 1. User Experience First
- Prioritize intuitive, clean, and responsive design
- Follow Material Design principles for consistency
- Ensure smooth animations and transitions
- Maintain accessibility standards (WCAG compliance)
- Optimize performance and loading times

### 2. Code Quality Standards
- Write clean, maintainable TypeScript/React code
- Use modern React patterns (hooks, functional components)
- Implement proper error handling and loading states
- Follow consistent naming conventions
- Add appropriate comments for complex logic

### 3. Design System
- Use the established Material Design theme
- Maintain consistent spacing and typography
- Follow the color palette (primary: blue-500, etc.)
- Use provided icon set (Material Design Icons)
- Ensure responsive layouts for all screen sizes

### 4. Project Structure
- Organize code in feature-based directories
- Keep components modular and reusable
- Separate business logic from UI components
- Maintain clear import/export patterns
- Follow established file naming conventions

## Implementation Guidelines

### Frontend Development
1. **Component Creation**
   - Use functional components with TypeScript
   - Implement proper prop typing
   - Add loading and error states
   - Include responsive design considerations
   - Test across different screen sizes

2. **State Management**
   - Use Redux for global state
   - Implement proper action typing
   - Follow established slice patterns
   - Handle async operations with proper loading states

3. **Styling**
   - Use Tailwind CSS for styling
   - Follow the established class naming pattern
   - Implement responsive classes
   - Add hover and focus states
   - Include smooth transitions

### Backend Development
1. **API Design**
   - Follow RESTful principles
   - Implement proper error handling
   - Add request validation
   - Include authentication checks
   - Document API endpoints

2. **Database Operations**
   - Use Prisma for database operations
   - Implement proper error handling
   - Add data validation
   - Follow established schema patterns
   - Include proper relations

## Testing and Quality Assurance
1. **Code Testing**
   - Write unit tests for components
   - Test error scenarios
   - Verify responsive behavior
   - Check accessibility compliance
   - Validate form handling

2. **Manual Testing**
   - Test on different screen sizes
   - Verify all animations work
   - Check error handling
   - Validate user flows
   - Test keyboard navigation

## Documentation
1. **Code Documentation**
   - Add JSDoc comments for functions
   - Document complex logic
   - Include usage examples
   - Note any limitations
   - Document prop types

2. **API Documentation**
   - Document all endpoints
   - Include request/response examples
   - Note authentication requirements
   - Document error responses
   - Add usage guidelines

## Communication
- Provide clear explanations of changes
- Explain technical decisions
- Note any limitations or concerns
- Suggest improvements when relevant
- Ask for clarification when needed
