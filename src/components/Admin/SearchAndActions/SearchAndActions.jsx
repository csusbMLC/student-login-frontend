/**
 * SearchAndActions component displays a search input field and action buttons.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.searchVal - The current value of the search input field.
 * @param {Function} props.setSearchVal - A function to update the value of the search input field.
 * @param {Function} props.handleDisplay - A function to handle the display of different components.
 * @param {Array} props.data - An array of data used for exporting students.
 * @returns {JSX.Element} The rendered SearchAndActions component.
 */
import { Group, TextInput, Button, Modal } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import ExportStudents from "@components/Admin/ExportStudents/ExportStudents";
import { useDisclosure } from "@mantine/hooks";

const SearchAndActions = ({ searchVal, setSearchVal, handleDisplay, data }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Group justify="space-between" mb="xl">
      <TextInput
        placeholder="Search"
        size="sm"
        leftSection={<IconSearch />}
        styles={{ section: { pointerEvents: "none" } }}
        value={searchVal}
        onChange={(e) => setSearchVal(e.target.value)}
      />
      <Button
        onClick={() => handleDisplay("showAddStudentForm")}
        color="green"
        variant="filled"
      >
        Add Student
      </Button>
      <Button
        onClick={() => handleDisplay("showImportStudentsForm")}
        color="green"
        variant="filled"
      >
        Import Students
      </Button>
      <Modal opened={opened} onClose={close} title="Export to Spreadsheet">
        <ExportStudents students={data} />
      </Modal>
      <Button onClick={open} color="green" variant="filled">
        Export Time
      </Button>
    </Group>
  );
};

export default SearchAndActions;
