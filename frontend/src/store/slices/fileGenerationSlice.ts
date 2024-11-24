import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface FileStructure {
  name: string;
  content: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileStructure[];
}

interface FileGenerationState {
  files: FileStructure[];
  selectedFile: string | null;
  previewContent: string | null;
  isExporting: boolean;
  exportProgress: number;
  error: string | null;
}

const initialState: FileGenerationState = {
  files: [],
  selectedFile: null,
  previewContent: null,
  isExporting: false,
  exportProgress: 0,
  error: null,
};

export const fileGenerationSlice = createSlice({
  name: 'fileGeneration',
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<FileStructure[]>) => {
      state.files = action.payload;
    },
    selectFile: (state, action: PayloadAction<string>) => {
      state.selectedFile = action.payload;
    },
    setPreviewContent: (state, action: PayloadAction<string | null>) => {
      state.previewContent = action.payload;
    },
    setExportProgress: (state, action: PayloadAction<number>) => {
      state.exportProgress = action.payload;
    },
    setIsExporting: (state, action: PayloadAction<boolean>) => {
      state.isExporting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFiles,
  selectFile,
  setPreviewContent,
  setExportProgress,
  setIsExporting,
  setError,
} = fileGenerationSlice.actions;

// Selectors
export const selectFileStructure = (state: RootState) => state.fileGeneration.files;
export const selectSelectedFile = (state: RootState) => state.fileGeneration.selectedFile;
export const selectPreviewContent = (state: RootState) => state.fileGeneration.previewContent;
export const selectExportProgress = (state: RootState) => state.fileGeneration.exportProgress;
export const selectIsExporting = (state: RootState) => state.fileGeneration.isExporting;
export const selectError = (state: RootState) => state.fileGeneration.error;

export default fileGenerationSlice.reducer;
