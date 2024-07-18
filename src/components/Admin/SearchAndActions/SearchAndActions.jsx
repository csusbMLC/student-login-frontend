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
import ResetAllStudents from "@components/Admin/ResetAll/ResetAllStudents";
import StudentStatus from "../StudentStatus/StudentStatus";

const SearchAndActions = ({ searchVal, setSearchVal, handleDisplay, data }) => {
  const [openedExport, { open: openExport, close: closeExport }] =
    useDisclosure(false);
  const [openedReset, { open: openReset, close: closeReset }] =
    useDisclosure(false);
  const [openedStatus, { open: openStatus, close: closeStatus }] =
    useDisclosure(false);

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
      <Group>
        <Modal size={"50%"} opened={openedStatus} onClose={closeStatus}>
          <StudentStatus data={data} />
        </Modal>
        <Button
          className="btn-std"
          onClick={openStatus}
          color="yellow"
          variant="filled"
        >
          Status
        </Button>
        <Modal
          opened={openedReset}
          onClose={closeReset}
          title="Reset All Students"
        >
          <ResetAllStudents data={data} />
        </Modal>
        <Button
          className="btn-std"
          onClick={openReset}
          color="red"
          variant="filled"
        >
          Reset All
        </Button>
        <Button
          className="btn-std"
          onClick={() => handleDisplay("showAddStudentForm")}
          color="green"
          variant="filled"
        >
          Add
        </Button>
        <Button
          className="btn-std"
          onClick={() => handleDisplay("showImportStudentsForm")}
          color="green"
          variant="filled"
        >
          Import
        </Button>
        <Modal
          opened={openedExport}
          onClose={closeExport}
          title="Export to Spreadsheet"
        >
          <ExportStudents students={data} />
        </Modal>
        <Button
          className="btn-std"
          onClick={openExport}
          color="green"
          variant="filled"
        >
          Export
        </Button>
      </Group>
    </Group>
  );
};

export default SearchAndActions;
