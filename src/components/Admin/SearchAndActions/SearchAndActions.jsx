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
