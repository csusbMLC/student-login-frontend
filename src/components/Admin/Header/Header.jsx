/**
 * Renders the header component for the admin section.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.user - The username of the logged-in user.
 * @param {Function} props.handleLogout - The function to handle user logout.
 * @returns {JSX.Element} The rendered header component.
 */
import { Group, UnstyledButton, Title, Button, Menu } from "@mantine/core";

function Header({ user, handleLogout }) {
  return (
    <Group justify="space-between" mb={"xl"}>
      <Menu>
        <Menu.Target>
          <UnstyledButton>{user}</UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>
            <Button>Profile Settings</Button>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Title order={1}>MLC Admin Home</Title>
      <Button onClick={handleLogout}>{"Logout"}</Button>
    </Group>
  );
}

export default Header;
