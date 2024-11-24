import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node, Edge } from '@xyflow/react';

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
}

const initialState: FlowState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
};

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    setSelectedNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
    },
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
    },
    addEdge: (state, action: PayloadAction<Edge>) => {
      state.edges.push(action.payload);
    },
    updateNodeData: (state, action: PayloadAction<{ id: string; data: any }>) => {
      const node = state.nodes.find(n => n.id === action.payload.id);
      if (node) {
        node.data = { ...node.data, ...action.payload.data };
      }
    },
  },
});

export const {
  setNodes,
  setEdges,
  setSelectedNode,
  addNode,
  addEdge,
  updateNodeData,
} = flowSlice.actions;

export default flowSlice.reducer;
