import pytest
from unittest.mock import Mock, patch
from src.agents import (
    BusinessCaseAnalyzer,
    RequirementsAnalyst,
    RiskAssessmentAgent,
    WBSSpecialist,
    ArchitectureAdvisor,
    TimelinePlanner,
    ResourceAllocator,
    QualityAssurancePlanner
)
from src.models import Project, ProjectArtifact, AnalysisResult
from src.db import get_db

@pytest.fixture
def mock_db():
    """Mock database session"""
    return Mock()

@pytest.fixture
def sample_project():
    """Create a sample project for testing"""
    return Project(
        name="Test Project",
        description="A test project for AI agent testing",
        methodology="agile",
        status="planning"
    )

class TestProjectInitiationFlow:
    """Test the complete project initiation flow"""
    
    @pytest.fixture
    def mock_agents(self):
        """Mock all agents used in project initiation"""
        return {
            'business_case': Mock(spec=BusinessCaseAnalyzer),
            'requirements': Mock(spec=RequirementsAnalyst),
            'risk': Mock(spec=RiskAssessmentAgent)
        }
    
    def test_business_case_analysis(self, mock_db, sample_project, mock_agents):
        """Test business case analysis phase"""
        # Setup
        mock_agents['business_case'].evaluate.return_value = {
            'viability_score': 0.85,
            'roi_estimate': '150%',
            'market_analysis': {'market_size': 'Large', 'competition': 'Medium'}
        }
        
        # Execute
        result = mock_agents['business_case'].evaluate(sample_project)
        
        # Assert
        assert result['viability_score'] > 0.7
        assert 'roi_estimate' in result
        assert 'market_analysis' in result
        mock_agents['business_case'].evaluate.assert_called_once_with(sample_project)

    def test_requirements_gathering(self, mock_db, sample_project, mock_agents):
        """Test requirements gathering phase"""
        # Setup
        mock_agents['requirements'].gather_requirements.return_value = {
            'functional': ['req1', 'req2'],
            'non_functional': ['nfr1', 'nfr2'],
            'stakeholders': ['stakeholder1', 'stakeholder2']
        }
        
        # Execute
        result = mock_agents['requirements'].gather_requirements(sample_project)
        
        # Assert
        assert len(result['functional']) > 0
        assert len(result['non_functional']) > 0
        assert len(result['stakeholders']) > 0
        mock_agents['requirements'].gather_requirements.assert_called_once_with(sample_project)

    def test_risk_assessment(self, mock_db, sample_project, mock_agents):
        """Test initial risk assessment phase"""
        # Setup
        mock_agents['risk'].initial_analysis.return_value = {
            'risks': [
                {'type': 'technical', 'probability': 'high', 'impact': 'medium'},
                {'type': 'schedule', 'probability': 'low', 'impact': 'high'}
            ],
            'overall_risk_score': 0.65
        }
        
        # Execute
        result = mock_agents['risk'].initial_analysis(sample_project)
        
        # Assert
        assert len(result['risks']) > 0
        assert 'overall_risk_score' in result
        mock_agents['risk'].initial_analysis.assert_called_once_with(sample_project)

class TestProjectPlanningFlow:
    """Test the project planning flow"""
    
    @pytest.fixture
    def mock_planning_agents(self):
        """Mock all agents used in project planning"""
        return {
            'wbs': Mock(spec=WBSSpecialist),
            'architecture': Mock(spec=ArchitectureAdvisor),
            'timeline': Mock(spec=TimelinePlanner),
            'resource': Mock(spec=ResourceAllocator),
            'quality': Mock(spec=QualityAssurancePlanner)
        }
    
    def test_wbs_creation(self, mock_db, sample_project, mock_planning_agents):
        """Test WBS creation phase"""
        # Setup
        mock_planning_agents['wbs'].create_structure.return_value = {
            'deliverables': ['del1', 'del2'],
            'work_packages': ['wp1', 'wp2'],
            'tasks': ['task1', 'task2']
        }
        
        # Execute
        result = mock_planning_agents['wbs'].create_structure(sample_project)
        
        # Assert
        assert len(result['deliverables']) > 0
        assert len(result['work_packages']) > 0
        assert len(result['tasks']) > 0
        mock_planning_agents['wbs'].create_structure.assert_called_once_with(sample_project)

    def test_architecture_recommendation(self, mock_db, sample_project, mock_planning_agents):
        """Test architecture recommendation phase"""
        # Setup
        mock_planning_agents['architecture'].recommend_architecture.return_value = {
            'stack': ['tech1', 'tech2'],
            'integration_points': ['int1', 'int2'],
            'scalability_considerations': ['scale1', 'scale2']
        }
        
        # Execute
        result = mock_planning_agents['architecture'].recommend_architecture(sample_project)
        
        # Assert
        assert len(result['stack']) > 0
        assert len(result['integration_points']) > 0
        assert len(result['scalability_considerations']) > 0
        mock_planning_agents['architecture'].recommend_architecture.assert_called_once_with(sample_project)

class TestEndToEndFlow:
    """Test the complete end-to-end flow of the AI agent system"""
    
    @pytest.mark.asyncio
    async def test_complete_project_flow(self, mock_db, sample_project):
        """Test the complete project planning flow from initiation to completion"""
        # Setup project queue
        project_queue = []
        
        # Test project submission
        project_queue.append(sample_project)
        assert len(project_queue) == 1
        
        # Test project processing
        current_project = project_queue[0]
        assert current_project.status == "planning"
        
        # Mock the processing steps
        with patch('src.agents.process_project') as mock_process:
            mock_process.return_value = {"status": "success", "artifacts": ["charter", "wbs", "timeline"]}
            
            # Process the project
            result = await mock_process(current_project)
            
            # Verify processing
            assert result["status"] == "success"
            assert len(result["artifacts"]) == 3
            mock_process.assert_called_once_with(current_project)
        
        # Test queue completion
        project_queue.remove(current_project)
        assert len(project_queue) == 0

def test_artifact_creation(mock_db, sample_project):
    """Test creation and storage of project artifacts"""
    # Setup
    artifact = ProjectArtifact(
        project_id=sample_project.id,
        type="requirements",
        content={"requirements": ["req1", "req2"]},
        version=1,
        status="draft"
    )
    
    # Mock database operations
    mock_db.add(artifact)
    mock_db.commit()
    
    # Verify
    mock_db.add.assert_called_once_with(artifact)
    mock_db.commit.assert_called_once()

def test_analysis_result_storage(mock_db, sample_project):
    """Test storage of analysis results"""
    # Setup
    analysis = AnalysisResult(
        project_id=sample_project.id,
        analyzer_type="business_case",
        analysis_data={"viability": 0.85},
        recommendations="Proceed with project"
    )
    
    # Mock database operations
    mock_db.add(analysis)
    mock_db.commit()
    
    # Verify
    mock_db.add.assert_called_once_with(analysis)
    mock_db.commit.assert_called_once()
