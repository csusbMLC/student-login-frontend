import {
  TextInput,
  Button,
  Card,
  Box,
  Text,
  Paper,
  Grid,
  Title,
  Group,
  Stack,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { getStudent } from "@src/services/apiServices";

/**
 * Checks if a student exists based on the provided student ID.
 *
 * @param {string} studentId - The ID of the student to check.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the student exists or not.
 */
const studentExists = async (studentId) => {
  try {
    const student = await getStudent(studentId);
    return !!student;
  } catch (error) {
    return false;
  }
};

/**
 * AddStudentForm component displays a form to add a new student.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.onSubmit - The function to handle form submission.
 * @param {Function} props.onCancel - The function to handle form cancellation.
 * @returns {JSX.Element} The rendered AddStudentForm component.
 */
const AddStudentForm = ({ onSubmit, onCancel }) => {
  const handleAddClass = () => {
    const newClass = {
      className: "",
      section: "",
      professor: "",
    };
    form.insertListItem("classes", newClass);
  };

  /**
   * Handles the form submission for adding a new student.
   */
  const handleSubmit = () => {
    studentExists(form.values.studentId).then((duplicateStudent) => {
      if (!duplicateStudent) {
        console.log("New student ready to add!");
        const transformedClasses = form.values.classes.map((classItem) => {
          return `${classItem.className}-${classItem.section}-${classItem.professor}`;
        });
        const newStudent = {
          studentName: form.values.name,
          studentId: form.values.studentId,
          classes: transformedClasses,
        };
        onSubmit(newStudent, onCancel);
      } else {
        window.alert(
          `Sorry student ID: ${form.values.studentId} already exists!`
        );
      }
    });
  };

  /**
   * Represents a form object used for managing form state and validation.
   *
   * @typedef {Object} Form
   * @property {Object} initialValues - The initial values for the form fields.
   * @property {Object} validate - The validation rules for the form fields.
   * @property {Function} validate.name - The validation function for the "name" field.
   * @property {Function} validate.studentId - The validation function for the "studentId" field.
   * @property {Object} validate.classes - The validation rules for the "classes" field.
   * @property {Function} validate.classes.className - The validation function for the "className" field in the "classes" array.
   * @property {Function} validate.classes.section - The validation function for the "section" field in the "classes" array.
   * @property {Function} validate.classes.professor - The validation function for the "professor" field in the "classes" array.
   */
  const form = useForm({
    initialValues: {
      name: "",
      studentId: "",
      classes: [{ className: "", section: "", professor: "" }],
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      studentId: (value) =>
        value.length < 9 ? "Student ID must have at least 9 digits" : null,
      classes: {
        className: (value) =>
          /\b[A-Z]+ \d+\b/.test(value)
            ? null
            : "Class name must be in the format ABC 1234",
        section: (value) =>
          /^\d{2}$/.test(value) ? null : "Section must be a 2-digit number",
        professor: (value) =>
          /^[A-Za-z]+(?:-[A-Za-z]+)?$/.test(value)
            ? null
            : "Professor name must be in the format First-Last or First-Last-Last",
      },
    },
  });

  const classes = form.values.classes.map((classItem, index) => {
    return (
      <Card withBorder shadow="sm" p="md" mb="md" key={index}>
        <Grid>
          <Grid.Col span={4}>
            <TextInput
              label="Class Name"
              {...form.getInputProps(`classes.${index}.className`)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Class Section"
              {...form.getInputProps(`classes.${index}.section`)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Professor"
              {...form.getInputProps(`classes.${index}.professor`)}
            />
          </Grid.Col>
          <Grid.Col span={12} style={{ alignItems: "end", display: "flex" }}>
            <Button
              style={{ alignSelf: "center" }}
              color="red"
              onClick={() => form.removeListItem("classes", index)}
            >
              <IconTrash />
            </Button>
          </Grid.Col>
        </Grid>
      </Card>
    );
  });

  return (
    <Paper padding="md" style={{ maxWidth: "500px" }} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="md">
          <TextInput
            label="Name"
            placeholder="Enter student's name"
            name="name"
            required
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Student ID"
            placeholder="Enter student's ID"
            name="studentId"
            required
            {...form.getInputProps("studentId")}
          />
        </Stack>
        <Box>
          <Title order={4} mt="md" mb="sm">
            Classes
          </Title>
          {classes.length ? classes : <Text>No classes added</Text>}
        </Box>
        <Group position="right" mt="md" justify="space-between">
          <Button
            type="button"
            color="green"
            variant="filled"
            autoContrast
            onClick={handleAddClass}
          >
            Add Class
          </Button>
          <Box>
            <Button
              type="submit"
              color="blue"
              variant="filled"
              autoContrast
              mr={"sm"}
            >
              Add Student
            </Button>
            <Button
              type="button"
              variant="light"
              autoContrast
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Box>
        </Group>
      </form>
    </Paper>
  );
};

export default AddStudentForm;
