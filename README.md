# Generative Project Management System

DevelopmentGoals:

Do the following in a /frontend directory
[X] 1. Setup a basic react project and install tailwindcss, @xyflow/react, redux, react-router-dom, react-icons, etc.
[X] 2. Define the theme for the project in the tailwind.config.js file, ensure its scaleable, responsive, accessible and easy to use. The rest of the more specific styling will be done with tailwindcss.
[X] 3. Create a state management system using redux and react-router-dom for navigation.
[X] 4. Create a polished google aesthetic landing page that looks modern. Also create a sign up and sign in page. Then create a dashboard page thats blank for now with an empty sidebar and a dashboard that takes up most of the page and will change based on the sidebar page you choose. the dashboard is the main hub for exploring the website.
[X] 5. Review the initial codebase and make sure its written in a clean and organized way with modern coding patterns and best practices. However the code should still be readable and easy to understand for other developers while not being too overdocumented.

Do the following in a /backend directory
[X] 6. Setup a backend server using express and nodejs.
[X] 7. Setup a sqllite database and only setup user authentication for now. The password should be encrypted using bcrypt and the table should just have a uid, email, password so the user can login. Use JWT to ensure the user is logged in and can access their data.
[X] 8. Once this initial groundwork is done, then i will start to work on the gernative project management ai agents system.

Next Goals:
[X] 9. Create a state management system using redux and react-router-dom for navigation. Make sure after the user is logged in or if they have a token stored in their local storage, they are redirected to the dashboard page. The only way they can access the sign in and sign up pages is if they are not logged in. Setup testing for the state management system and create tests that will be ran when i do /run_tests.sh to ensure all parts of the system are working.
[X] 10. Setup the Generative AI Components Infrastructure:
   - Create a new `GenerativeComponent` directory in the frontend
   - Setup Redux slices for managing AI state and responses
   - Implement WebSocket connection for real-time updates
   - Create basic UI components for the AI interaction panel

[X] 11. Implement Core AI Visualization Features:
   - Integrate @xyflow/react for visual flow representation
   - Create interactive flow visualization panel
   - Connect visualization with AI state management
   - Implement drag-and-drop functionality for node arrangement
   - Add zoom and pan controls for better visualization

[X] 12. Develop AI Integration Layer:
   - Setup environment configurations for chosen LLM (GPT-4/Claude/Ollama)
   - Create API endpoints for model communication
   - Implement prompt management system
   - Setup streaming response handling

[X] 13. Create Project Generation Interface:
   - Design and implement prompt input interface
   - Create project template selection system
   - Add real-time visualization of generation process
   - Implement progress indicators and status updates

[X] 14. Implement File Generation and Export:
   - Create file structure generator based on AI responses
   - Implement syntax highlighting for generated code
   - Add file preview functionality
   - Create download system for individual files and full project export

[X] 15. Add Error Handling and Validation:
   - Implement input validation for prompts
   - Add error handling for API failures
   - Create user feedback system
   - Add retry mechanisms for failed generations

[ ] 16. Enhance User Experience:
   - Add loading states and animations
   - Implement undo/redo functionality
   - Create help documentation and tooltips
   - Add example prompts and templates

[ ] 17. Testing and Optimization:
   - Write unit tests for AI components
   - Add integration tests for file generation
   - Optimize performance for large projects
   - Implement caching for frequent operations

--- DO NOT REFERENCE THESE ARE MY PERSONAL NOTES
Storing projects?
Setup a new table that has the uid and a collection of their project_id 's. Figure out a comprehensive way to store project data as plain text which can be parsed and loaded by the frontend to show their project.
