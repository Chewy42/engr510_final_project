const {
  BusinessCaseAnalyzer,
  RequirementsAnalyst,
  RiskAssessmentAgent,
  WBSSpecialist,
  ArchitectureAdvisor,
  TimelinePlanner,
  ResourceAllocator,
  QualityAssurancePlanner
} = require('../src/agents');
const { Project, ProjectArtifact, AnalysisResult } = require('../src/models');
const db = require('../src/db');

// Mock database
jest.mock('../src/db');

describe('Project Initiation Flow', () => {
  let mockDb;
  let sampleProject;

  beforeEach(() => {
    mockDb = {
      prepare: jest.fn().mockReturnThis(),
      run: jest.fn(),
      get: jest.fn(),
      all: jest.fn()
    };

    sampleProject = new Project({
      id: 1,
      name: 'Test Project',
      description: 'A test project',
      status: 'initiation'
    });
  });

  describe('Business Case Analysis', () => {
    let businessCaseAnalyzer;

    beforeEach(() => {
      businessCaseAnalyzer = new BusinessCaseAnalyzer();
    });

    test('should analyze business case successfully', async () => {
      const result = await businessCaseAnalyzer.analyze(sampleProject);
      expect(result).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });
  });

  describe('Requirements Gathering', () => {
    let requirementsAnalyst;

    beforeEach(() => {
      requirementsAnalyst = new RequirementsAnalyst();
    });

    test('should gather requirements successfully', async () => {
      const result = await requirementsAnalyst.analyze(sampleProject);
      expect(result).toBeDefined();
      expect(result.requirements).toBeDefined();
    });
  });

  describe('Risk Assessment', () => {
    let riskAssessmentAgent;

    beforeEach(() => {
      riskAssessmentAgent = new RiskAssessmentAgent();
    });

    test('should assess risks successfully', async () => {
      const result = await riskAssessmentAgent.analyze(sampleProject);
      expect(result).toBeDefined();
      expect(result.risks).toBeDefined();
    });
  });
});

describe('Project Planning Flow', () => {
  let mockDb;
  let sampleProject;

  beforeEach(() => {
    mockDb = {
      prepare: jest.fn().mockReturnThis(),
      run: jest.fn(),
      get: jest.fn(),
      all: jest.fn()
    };

    sampleProject = new Project({
      id: 1,
      name: 'Test Project',
      description: 'A test project',
      status: 'planning'
    });
  });

  describe('WBS Creation', () => {
    let wbsSpecialist;

    beforeEach(() => {
      wbsSpecialist = new WBSSpecialist();
    });

    test('should create WBS successfully', async () => {
      const result = await wbsSpecialist.analyze(sampleProject);
      expect(result).toBeDefined();
      expect(result.wbs).toBeDefined();
    });
  });

  describe('Architecture Recommendation', () => {
    let architectureAdvisor;

    beforeEach(() => {
      architectureAdvisor = new ArchitectureAdvisor();
    });

    test('should recommend architecture successfully', async () => {
      const result = await architectureAdvisor.analyze(sampleProject);
      expect(result).toBeDefined();
      expect(result.architecture).toBeDefined();
    });
  });
});

describe('End-to-End Flow', () => {
  let mockDb;
  let sampleProject;

  beforeEach(() => {
    mockDb = {
      prepare: jest.fn().mockReturnThis(),
      run: jest.fn(),
      get: jest.fn(),
      all: jest.fn()
    };

    sampleProject = new Project({
      id: 1,
      name: 'Test Project',
      description: 'A test project',
      status: 'initiation'
    });
  });

  test('should complete project flow successfully', async () => {
    // Run through all phases
    const businessCaseAnalyzer = new BusinessCaseAnalyzer();
    const requirementsAnalyst = new RequirementsAnalyst();
    const riskAssessmentAgent = new RiskAssessmentAgent();
    const wbsSpecialist = new WBSSpecialist();
    const architectureAdvisor = new ArchitectureAdvisor();

    // Phase 1: Initiation
    const businessCase = await businessCaseAnalyzer.analyze(sampleProject);
    expect(businessCase).toBeDefined();

    const requirements = await requirementsAnalyst.analyze(sampleProject);
    expect(requirements).toBeDefined();

    const risks = await riskAssessmentAgent.analyze(sampleProject);
    expect(risks).toBeDefined();

    // Phase 2: Planning
    sampleProject.status = 'planning';

    const wbs = await wbsSpecialist.analyze(sampleProject);
    expect(wbs).toBeDefined();

    const architecture = await architectureAdvisor.analyze(sampleProject);
    expect(architecture).toBeDefined();
  });
});
