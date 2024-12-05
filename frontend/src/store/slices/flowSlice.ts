import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node, Edge } from 'reactflow';

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: FlowState = {
  nodes: [],
  edges: [],
  selectedNode: null,
  isLoading: false,
  error: null,
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
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
    },
    addEdge: (state, action: PayloadAction<Edge>) => {
      state.edges.push(action.payload);
    },
    updateNode: (state, action: PayloadAction<{ id: string; data: any }>) => {
      const node = state.nodes.find(n => n.id === action.payload.id);
      if (node) {
        node.data = { ...node.data, ...action.payload.data };
      }
    },
    removeNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter(node => node.id !== action.payload);
      state.edges = state.edges.filter(
        edge => edge.source !== action.payload && edge.target !== action.payload
      );
    },
    removeEdge: (state, action: PayloadAction<string>) => {
      state.edges = state.edges.filter(edge => edge.id !== action.payload);
    },
    setSelectedNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNode = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearFlow: (state) => {
      state.nodes = [];
      state.edges = [];
      state.selectedNode = null;
      state.error = null;
    },
  },
});

export const {
  setNodes,
  setEdges,
  addNode,
  addEdge,
  updateNode,
  removeNode,
  removeEdge,
  setSelectedNode,
  setLoading,
  setError,
  clearFlow,
} = flowSlice.actions;

export default flowSlice.reducer;
