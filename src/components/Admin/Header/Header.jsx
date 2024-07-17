/**
 * Renders the header component for the admin section.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.user - The username of the logged-in user.
 * @param {Function} props.handleLogout - The function to handle user logout.
 * @returns {JSX.Element} The rendered header component.
 */
import { Group, UnstyledButton, Title, Button } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import NightMode from "@components/Admin/NightMode/ActionToggle";

function Header({ user, handleLogout, handleDisplay }) {
  return (
    <Group justify="space-between" mb={"xl"}>
      <UnstyledButton className="btn-std">{user}</UnstyledButton>
      <Title order={1}>MLC Admin Home</Title>
      <Group>
        <Button className="btn-std" onClick={handleLogout}>
          {"Logout"}
        </Button>
        <Button
          variant="filled"
          color="gray"
          onClick={() => handleDisplay("showChangePassword")}
        >
          <IconSettings />
        </Button>
        <NightMode />
      </Group>
    </Group>
  );
}

export default Header;
