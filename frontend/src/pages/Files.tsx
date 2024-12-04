import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { FilterList, GetApp, Search } from '@mui/icons-material';
import { RootState } from '../store/configureStore';

interface GeneratedFile {
  id: string;
  name: string;
  project: string;
  aiAgent: string;
  timestamp: string;
  content: string;
  path: string;
}

const Files: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<GeneratedFile[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterType, setFilterType] = useState<'all' | 'project' | 'agent'>('all');

  // Fetch files data
  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchFiles = async () => {
      try {
        const response = await fetch('/api/files');
        const data = await response.json();
        setFiles(data);
        setFilteredFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };
    fetchFiles();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let filtered = files;
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.aiAgent.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filter type
    if (filterType !== 'all') {
      filtered = filtered.filter(file => {
        if (filterType === 'project') return file.project;
        if (filterType === 'agent') return file.aiAgent;
        return true;
      });
    }

    setFilteredFiles(filtered);
  }, [searchTerm, files, filterType]);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (type: 'all' | 'project' | 'agent') => {
    setFilterType(type);
    setAnchorEl(null);
  };

  const handleDownload = async (file: GeneratedFile) => {
    try {
      // TODO: Replace with actual download logic
      const response = await fetch(`/api/files/${file.id}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
          }}
          sx={{ maxWidth: '600px', mx: 'auto' }}
        />
        <Tooltip title="Filter">
          <IconButton onClick={handleFilterClick}>
            <FilterList />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleFilterClose('all')}>All Files</MenuItem>
          <MenuItem onClick={() => handleFilterClose('project')}>By Project</MenuItem>
          <MenuItem onClick={() => handleFilterClose('agent')}>By AI Agent</MenuItem>
        </Menu>
      </Box>

      <Paper sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
        <List>
          {filteredFiles.map((file) => (
            <ListItem
              key={file.id}
              divider
              secondaryAction={
                <Tooltip title="Download">
                  <IconButton edge="end" onClick={() => handleDownload(file)}>
                    <GetApp />
                  </IconButton>
                </Tooltip>
              }
            >
              <ListItemText
                primary={file.name}
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2" color="text.primary">
                      {file.project}
                    </Typography>
                    {` — Generated by ${file.aiAgent} • ${new Date(file.timestamp).toLocaleString()}`}
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
          {filteredFiles.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No files found"
                secondary="Try adjusting your search or filter settings"
              />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default Files;
