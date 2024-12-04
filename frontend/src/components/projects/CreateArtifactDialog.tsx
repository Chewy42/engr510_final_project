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
import { ArtifactType } from '../../types/project.types';
import { createProjectArtifact } from '../../store/slices/projectSlice';

interface CreateArtifactDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: number;
}

interface CreateArtifactRequest {
  type: ArtifactType;
  content: string;
}

const validationSchema = yup.object({
  type: yup
    .string()
    .oneOf(['requirements', 'wbs', 'gantt', 'risk_matrix', 'documentation'] as ArtifactType[])
    .required('Artifact type is required'),
  content: yup.string().required('Content is required'),
});

const artifactTypeLabels: Record<ArtifactType, string> = {
  requirements: 'Requirements Document',
  wbs: 'Work Breakdown Structure',
  gantt: 'Gantt Chart',
  risk_matrix: 'Risk Matrix',
  documentation: 'Documentation',
};

const CreateArtifactDialog: React.FC<CreateArtifactDialogProps> = ({
  open,
  onClose,
  projectId,
}) => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      type: '' as ArtifactType,
      content: '',
    },
    validationSchema,
    onSubmit: async (values: CreateArtifactRequest) => {
      try {
        await dispatch(
          createProjectArtifact({
            projectId,
            data: values,
          })
        );
        onClose();
        formik.resetForm();
      } catch (error) {
        console.error('Error creating artifact:', error);
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
        <DialogTitle>Create New Artifact</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="type-label">Artifact Type</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                error={formik.touched.type && Boolean(formik.errors.type)}
                label="Artifact Type"
              >
                {Object.entries(artifactTypeLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              id="content"
              name="content"
              label="Content"
              multiline
              rows={8}
              value={formik.values.content}
              onChange={formik.handleChange}
              error={formik.touched.content && Boolean(formik.errors.content)}
              helperText={formik.touched.content && formik.errors.content}
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
            Create Artifact
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateArtifactDialog;
