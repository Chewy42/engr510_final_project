import pytest
import asyncio
import websockets
import json
from src.app import app
from src.queue_manager import ProjectQueue
from src.websocket_handler import WebSocketHandler

@pytest.fixture
async def websocket_client():
    """Create a WebSocket client for testing"""
    uri = "ws://localhost:5000/ws"
    async with websockets.connect(uri) as websocket:
        yield websocket

@pytest.fixture
def project_queue():
    """Create a project queue for testing"""
    return ProjectQueue()

@pytest.mark.asyncio
async def test_websocket_connection(websocket_client):
    """Test WebSocket connection establishment"""
    try:
        await websocket_client.send(json.dumps({
            "type": "connection_test",
            "data": {"client_id": "test_client"}
        }))
        
        response = await websocket_client.recv()
        response_data = json.loads(response)
        
        assert response_data["type"] == "connection_acknowledged"
        assert "server_id" in response_data
    except websockets.exceptions.ConnectionClosed:
        pytest.fail("WebSocket connection closed unexpectedly")

@pytest.mark.asyncio
async def test_project_generation_request(websocket_client, project_queue):
    """Test sending a project generation request"""
    request_data = {
        "type": "generate_project",
        "data": {
            "description": "Create a React TypeScript project with authentication",
            "methodology": "agile"
        }
    }
    
    try:
        # Send generation request
        await websocket_client.send(json.dumps(request_data))
        
        # Should receive acknowledgment
        response = await websocket_client.recv()
        response_data = json.loads(response)
        
        assert response_data["type"] == "generation_started"
        assert "project_id" in response_data
        
        # Should receive progress updates
        progress_msg = await websocket_client.recv()
        progress_data = json.loads(progress_msg)
        
        assert progress_data["type"] == "progress_update"
        assert "current_step" in progress_data
        assert "progress_percentage" in progress_data
        
    except websockets.exceptions.ConnectionClosed:
        pytest.fail("WebSocket connection closed unexpectedly")

@pytest.mark.asyncio
async def test_queue_processing(project_queue):
    """Test project queue processing"""
    # Add a project to the queue
    project_data = {
        "description": "Test project",
        "methodology": "agile"
    }
    
    # Add to queue
    queue_id = await project_queue.add_project(project_data)
    assert queue_id is not None
    
    # Check queue status
    status = await project_queue.get_project_status(queue_id)
    assert status["status"] in ["queued", "processing"]
    
    # Process queue
    await project_queue.process_next()
    
    # Verify project was processed
    updated_status = await project_queue.get_project_status(queue_id)
    assert updated_status["status"] in ["completed", "failed"]

@pytest.mark.asyncio
async def test_agent_pipeline_integration(websocket_client, project_queue):
    """Test the complete integration of WebSocket, queue, and agent pipeline"""
    # Send project request
    request_data = {
        "type": "generate_project",
        "data": {
            "description": "Create an e-commerce platform",
            "methodology": "agile"
        }
    }
    
    try:
        # Send request
        await websocket_client.send(json.dumps(request_data))
        
        # Collect all messages until completion or timeout
        messages = []
        async with asyncio.timeout(30):  # 30 second timeout
            while True:
                message = await websocket_client.recv()
                message_data = json.loads(message)
                messages.append(message_data)
                
                if message_data["type"] == "generation_complete":
                    break
                elif message_data["type"] == "error":
                    pytest.fail(f"Error during generation: {message_data['error']}")
        
        # Verify message flow
        message_types = [msg["type"] for msg in messages]
        assert "generation_started" in message_types
        assert "progress_update" in message_types
        assert "generation_complete" in message_types
        
        # Verify final result
        final_message = messages[-1]
        assert final_message["type"] == "generation_complete"
        assert "artifacts" in final_message
        assert len(final_message["artifacts"]) > 0
        
    except asyncio.TimeoutError:
        pytest.fail("Test timed out waiting for completion")
    except websockets.exceptions.ConnectionClosed:
        pytest.fail("WebSocket connection closed unexpectedly")

@pytest.mark.asyncio
async def test_error_handling(websocket_client):
    """Test error handling in the WebSocket and agent pipeline"""
    # Send invalid request
    invalid_request = {
        "type": "generate_project",
        "data": {
            # Missing required fields
        }
    }
    
    try:
        await websocket_client.send(json.dumps(invalid_request))
        
        response = await websocket_client.recv()
        response_data = json.loads(response)
        
        assert response_data["type"] == "error"
        assert "message" in response_data
        
    except websockets.exceptions.ConnectionClosed:
        pytest.fail("WebSocket connection closed unexpectedly")

@pytest.mark.asyncio
async def test_concurrent_requests(websocket_client, project_queue):
    """Test handling of concurrent project generation requests"""
    # Create multiple project requests
    requests = [
        {
            "type": "generate_project",
            "data": {
                "description": f"Test project {i}",
                "methodology": "agile"
            }
        }
        for i in range(3)
    ]
    
    try:
        # Send all requests
        for request in requests:
            await websocket_client.send(json.dumps(request))
        
        # Collect project IDs from responses
        project_ids = []
        for _ in requests:
            response = await websocket_client.recv()
            response_data = json.loads(response)
            if response_data["type"] == "generation_started":
                project_ids.append(response_data["project_id"])
        
        assert len(project_ids) == len(requests)
        
        # Verify all projects are in queue
        for project_id in project_ids:
            status = await project_queue.get_project_status(project_id)
            assert status is not None
            
    except websockets.exceptions.ConnectionClosed:
        pytest.fail("WebSocket connection closed unexpectedly")
