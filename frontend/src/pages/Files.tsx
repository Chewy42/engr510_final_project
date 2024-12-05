import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Paper,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Skeleton,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  FilterList,
  GetApp,
  Search,
  ViewList,
  ViewModule,
  Description,
  Code,
  Image,
  MoreVert,
} from '@mui/icons-material';
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

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext || '')) return <Image />;
  if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp'].includes(ext || '')) return <Code />;
  return <Description />;
};

const Files: React.FC = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<GeneratedFile[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterType, setFilterType] = useState<'all' | 'project' | 'agent'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/files');
        const data = await response.json();
        setFiles(data);
        setFilteredFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  useEffect(() => {
    let filtered = files;
    
    if (searchTerm) {
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.aiAgent.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'list' | 'grid',
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleDownload = async (file: GeneratedFile) => {
    try {
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

  const renderGridView = () => (
    <Grid container spacing={2}>
      {loading
        ? Array.from(new Array(8)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Skeleton variant="rectangular" height={140} />
                  <Skeleton variant="text" sx={{ mt: 2 }} />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))
        : filteredFiles.map((file) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: theme.transitions.create(['box-shadow']),
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                      {getFileIcon(file.name)}
                    </ListItemIcon>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" component="div" gutterBottom>
                        {file.name}
                      </Typography>
                      <Chip
                        label={file.project}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Generated by {file.aiAgent}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {new Date(file.timestamp).toLocaleString()}
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <Tooltip title="Download">
                    <IconButton
                      size="small"
                      onClick={() => handleDownload(file)}
                      sx={{ ml: 'auto' }}
                    >
                      <GetApp fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
      {!loading && filteredFiles.length === 0 && (
        <Grid item xs={12}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: 'center',
              bgcolor: theme.palette.background.default,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No files found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filter settings
            </Typography>
          </Paper>
        </Grid>
      )}
    </Grid>
  );

  const renderListView = () => (
    <Paper variant="outlined" sx={{ mt: 2 }}>
      <List disablePadding>
        {loading
          ? Array.from(new Array(5)).map((_, index) => (
              <ListItem key={index} divider>
                <ListItemIcon>
                  <Skeleton variant="circular" width={24} height={24} />
                </ListItemIcon>
                <ListItemText
                  primary={<Skeleton variant="text" width="60%" />}
                  secondary={<Skeleton variant="text" width="40%" />}
                />
              </ListItem>
            ))
          : filteredFiles.map((file) => (
              <ListItemButton
                key={file.id}
                divider
                sx={{
                  transition: theme.transitions.create(['background-color']),
                }}
              >
                <ListItemIcon>
                  {getFileIcon(file.name)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1">
                        {file.name}
                      </Typography>
                      <Chip
                        label={file.project}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="text.primary">
                        Generated by {file.aiAgent}
                      </Typography>
                      {` • ${new Date(file.timestamp).toLocaleString()}`}
                    </React.Fragment>
                  }
                />
                <Tooltip title="Download">
                  <IconButton edge="end" onClick={() => handleDownload(file)}>
                    <GetApp />
                  </IconButton>
                </Tooltip>
              </ListItemButton>
            ))}
      </List>
    </Paper>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          bgcolor: theme.palette.background.default,
          borderRadius: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search
                  sx={{ color: 'action.active', mr: 1 }}
                  fontSize="small"
                />
              ),
            }}
          />
          <ToggleButtonGroup
            size="small"
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
          >
            <ToggleButton value="list" aria-label="list view">
              <ViewList fontSize="small" />
            </ToggleButton>
            <ToggleButton value="grid" aria-label="grid view">
              <ViewModule fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
          <Tooltip title="Filter">
            <IconButton
              size="small"
              onClick={handleFilterClick}
              sx={{
                bgcolor: filterType !== 'all' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                '&:hover': {
                  bgcolor: filterType !== 'all' ? alpha(theme.palette.primary.main, 0.2) : undefined,
                },
              }}
            >
              <FilterList fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 2,
        }}
      >
        <MenuItem onClick={() => handleFilterClose('all')}>All Files</MenuItem>
        <MenuItem onClick={() => handleFilterClose('project')}>By Project</MenuItem>
        <MenuItem onClick={() => handleFilterClose('agent')}>By AI Agent</MenuItem>
      </Menu>

      {viewMode === 'grid' ? renderGridView() : renderListView()}
    </Container>
  );
};

export default Files;
