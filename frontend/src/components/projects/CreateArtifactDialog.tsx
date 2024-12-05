import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ArtifactType } from '../../types/project.types';
import { createProjectArtifact } from '../../store/slices/projectSlice';
import { useAppDispatch } from '../../store/hooks';

interface CreateArtifactDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
}

const validationSchema = yup.object({
  type: yup.string().required('Artifact type is required'),
  content: yup.string().required('Content is required'),
  status: yup.string().required('Status is required')
});

const CreateArtifactDialog: React.FC<CreateArtifactDialogProps> = ({
  open,
  onClose,
  projectId
}) => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      type: '' as ArtifactType,
      content: '',
      status: 'draft'
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(
          createProjectArtifact({
            projectId,
            artifactData: values,
          })
        );
        onClose();
      } catch (error) {
        console.error('Failed to create artifact:', error);
      }
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Artifact</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              fullWidth
              name="type"
              label="Artifact Type"
              value={formik.values.type}
              onChange={formik.handleChange}
              error={formik.touched.type && Boolean(formik.errors.type)}
              helperText={formik.touched.type && formik.errors.type}
            >
              <MenuItem value="requirements">Requirements</MenuItem>
              <MenuItem value="wbs">WBS</MenuItem>
              <MenuItem value="gantt">Gantt Chart</MenuItem>
              <MenuItem value="risk_matrix">Risk Matrix</MenuItem>
              <MenuItem value="documentation">Documentation</MenuItem>
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="content"
              label="Content"
              value={formik.values.content}
              onChange={formik.handleChange}
              error={formik.touched.content && Boolean(formik.errors.content)}
              helperText={formik.touched.content && formik.errors.content}
            />
            <TextField
              select
              fullWidth
              name="status"
              label="Status"
              value={formik.values.status}
              onChange={formik.handleChange}
              error={formik.touched.status && Boolean(formik.errors.status)}
              helperText={formik.touched.status && formik.errors.status}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="review">Review</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateArtifactDialog;
