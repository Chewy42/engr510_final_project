import React from 'react';
import { useAppDispatch } from '../../hooks/redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ProjectMethodology, ProjectStatus } from '../../types/project.types';
import { createNewProject } from '../../store/slices/projectSlice';

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
}

interface CreateProjectRequest {
  name: string;
  description: string;
  methodology: ProjectMethodology;
  status: ProjectStatus;
  target_completion_date: string;
}

const validationSchema = yup.object({
  name: yup.string().required('Project name is required'),
  description: yup.string().required('Project description is required'),
  methodology: yup.string().oneOf(['agile', 'waterfall', 'hybrid']).required('Project methodology is required'),
  target_completion_date: yup.date().required('Target completion date is required'),
});

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      methodology: 'agile' as ProjectMethodology,
      target_completion_date: new Date().toISOString().split('T')[0],
      status: 'pending' as ProjectStatus,
    },
    validationSchema,
    onSubmit: async (values: CreateProjectRequest) => {
      try {
        await dispatch(createNewProject(values));
        onClose();
        formik.resetForm();
      } catch (error) {
        console.error('Error creating project:', error);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Project Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <TextField
              fullWidth
              id="description"
              name="description"
              label="Project Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />

            <FormControl fullWidth>
              <InputLabel id="methodology-label">Methodology</InputLabel>
              <Select
                labelId="methodology-label"
                id="methodology"
                name="methodology"
                value={formik.values.methodology}
                onChange={formik.handleChange}
                error={formik.touched.methodology && Boolean(formik.errors.methodology)}
                label="Methodology"
              >
                <MenuItem value="agile">Agile</MenuItem>
                <MenuItem value="waterfall">Waterfall</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              id="target_completion_date"
              name="target_completion_date"
              label="Target Completion Date"
              type="date"
              value={formik.values.target_completion_date}
              onChange={formik.handleChange}
              error={
                formik.touched.target_completion_date &&
                Boolean(formik.errors.target_completion_date)
              }
              helperText={
                formik.touched.target_completion_date && formik.errors.target_completion_date
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting}
          >
            Create Project
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateProjectDialog;
